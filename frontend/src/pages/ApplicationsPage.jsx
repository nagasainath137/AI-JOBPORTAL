import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { applicationsService, jobsService } from "../services/jobsService";

const STATUS_OPTIONS = ["pending", "reviewed", "shortlisted", "rejected"];

export default function ApplicationsPage() {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([jobsService.get(jobId), applicationsService.forJob(jobId)])
      .then(([jobRes, appsRes]) => {
        setJob(jobRes.data);
        setApplications(appsRes.data);
      })
      .finally(() => setLoading(false));
  }, [jobId]);

  const handleStatusChange = async (appId, status) => {
    await applicationsService.updateStatus(appId, status);
    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status } : a))
    );
  };

  if (loading) return <div className="loading-screen">Loading applications...</div>;

  return (
    <div className="page-container">
      <h1>Applications — {job?.title}</h1>
      <p className="text-muted">{applications.length} applicant(s)</p>

      {applications.length === 0 ? (
        <div className="empty-state">No applications yet.</div>
      ) : (
        <div className="applications-list">
          {applications.map((app) => (
            <div key={app.id} className="application-card">
              <div className="app-candidate">
                <strong>{app.candidate?.full_name || "Candidate"}</strong>
                <span className="text-muted">{app.candidate?.email}</span>
                {app.candidate?.location && <span>📍 {app.candidate.location}</span>}
              </div>

              <div className="app-meta">
                <span>Applied {new Date(app.applied_at).toLocaleDateString()}</span>
                {app.ai_match_score != null && (
                  <span className="match-score">AI Match: {app.ai_match_score}%</span>
                )}
              </div>

              {app.cover_letter && (
                <div className="app-cover-letter">
                  <strong>Cover Letter</strong>
                  <p>{app.cover_letter}</p>
                </div>
              )}

              <div className="app-actions">
                <label>Status:</label>
                <select
                  value={app.status}
                  onChange={(e) => handleStatusChange(app.id, e.target.value)}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {app.candidate?.resume_path && (
                  <a
                    href={`${process.env.REACT_APP_API_URL}/${app.candidate.resume_path}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-sm"
                  >
                    View Resume
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
