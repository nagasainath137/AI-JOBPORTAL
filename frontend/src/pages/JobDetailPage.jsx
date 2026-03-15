import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jobsService, applicationsService } from "../services/jobsService";
import { useAuth } from "../context/AuthContext";

export default function JobDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [applied, setApplied] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    jobsService.get(id)
      .then((res) => setJob(res.data))
      .catch(() => navigate("/jobs"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleApply = async () => {
    setError("");
    try {
      await applicationsService.apply(id, { cover_letter: coverLetter });
      setApplied(true);
      setApplying(false);
    } catch (err) {
      setError(err.response?.data?.detail || "Application failed");
    }
  };

  if (loading) return <div className="loading-screen">Loading job...</div>;
  if (!job) return null;

  const tags = job.tags ? job.tags.split(",").map((t) => t.trim()) : [];

  return (
    <div className="page-container job-detail">
      <div className="job-detail-header">
        <div>
          <h1>{job.title}</h1>
          <div className="job-card-meta">
            {job.location && <span>📍 {job.location}</span>}
            {job.category && <span>🗂 {job.category}</span>}
            {job.salary_min && (
              <span>
                💰 ${job.salary_min.toLocaleString()}
                {job.salary_max && ` – $${job.salary_max.toLocaleString()}`}
              </span>
            )}
          </div>
          {tags.length > 0 && (
            <div className="job-tags" style={{ marginTop: "0.75rem" }}>
              {tags.map((tag) => <span key={tag} className="tag">{tag}</span>)}
            </div>
          )}
        </div>

        {user?.role === "candidate" && !applied && (
          <button className="btn-primary" onClick={() => setApplying(true)}>
            Apply Now
          </button>
        )}
        {applied && <div className="alert alert-success">Application submitted! ✓</div>}
      </div>

      <div className="job-description">
        <h2>About this role</h2>
        <p style={{ whiteSpace: "pre-wrap" }}>{job.description}</p>
      </div>

      {/* apply modal */}
      {applying && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Apply for {job.title}</h2>
            {error && <div className="alert alert-error">{error}</div>}
            <div className="form-group">
              <label>Cover Letter (optional)</label>
              <textarea
                rows={8}
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Tell the recruiter why you're a great fit..."
              />
            </div>
            <div className="modal-actions">
              <button className="btn-ghost" onClick={() => setApplying(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleApply}>Submit Application</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
