import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { dashboardService, jobsService, applicationsService } from "../services/jobsService";

export default function RecruiterDashboard() {
  const [stats, setStats] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([dashboardService.recruiter(), jobsService.list()])
      .then(([statsRes, jobsRes]) => {
        setStats(statsRes.data);
        // only show this recruiter's jobs — filter on frontend since list returns all active
        // TODO: add /api/jobs/mine endpoint to avoid this
        setJobs(jobsRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (jobId) => {
    if (!window.confirm("Delete this job posting?")) return;
    await jobsService.remove(jobId);
    setJobs((prev) => prev.filter((j) => j.id !== jobId));
  };

  if (loading) return <div className="loading-screen">Loading dashboard...</div>;

  return (
    <div className="page-container">
      <div className="dashboard-header">
        <h1>Recruiter Dashboard</h1>
        <Link to="/jobs/new" className="btn-primary">+ Post New Job</Link>
      </div>

      {stats && (
        <div className="stats-grid">
          <StatCard label="Total Jobs" value={stats.total_jobs} icon="💼" />
          <StatCard label="Active Listings" value={stats.active_jobs} icon="✅" />
          <StatCard label="Applications" value={stats.total_applications} icon="📋" />
          <StatCard label="Shortlisted" value={stats.shortlisted_count} icon="⭐" />
        </div>
      )}

      <h2 style={{ marginTop: "2rem" }}>Your Job Postings</h2>
      {jobs.length === 0 ? (
        <div className="empty-state">No jobs posted yet. <Link to="/jobs/new">Post your first job</Link></div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Location</th>
                <th>Posted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id}>
                  <td><Link to={`/jobs/${job.id}`}>{job.title}</Link></td>
                  <td><span className={`status-badge status-${job.status}`}>{job.status}</span></td>
                  <td>{job.location || "—"}</td>
                  <td>{new Date(job.created_at).toLocaleDateString()}</td>
                  <td className="table-actions">
                    <Link to={`/jobs/${job.id}/applications`} className="btn-sm">Applications</Link>
                    <Link to={`/jobs/${job.id}/edit`} className="btn-sm btn-outline">Edit</Link>
                    <button onClick={() => handleDelete(job.id)} className="btn-sm btn-danger">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div className="stat-card">
      <span className="stat-icon">{icon}</span>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
}
