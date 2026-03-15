import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { dashboardService, applicationsService } from "../services/jobsService";
import { useAuth } from "../context/AuthContext";

export default function CandidateDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([dashboardService.candidate(), applicationsService.myApplications()])
      .then(([statsRes, appsRes]) => {
        setStats(statsRes.data);
        setApplications(appsRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-screen">Loading dashboard...</div>;

  return (
    <div className="page-container">
      <div className="dashboard-header">
        <div>
          <h1>Welcome back, {user?.full_name?.split(" ")[0]}</h1>
          <p className="text-muted">Track your applications and use AI tools</p>
        </div>
        <Link to="/ai-tools" className="btn-primary">✨ AI Tools</Link>
      </div>

      {stats && (
        <div className="stats-grid">
          <StatCard label="Jobs Applied" value={stats.total_applied} icon="📤" />
          <StatCard label="Pending" value={stats.pending} icon="⏳" />
          <StatCard label="Shortlisted" value={stats.shortlisted} icon="⭐" />
          <StatCard label="Rejected" value={stats.rejected} icon="❌" />
        </div>
      )}

      <h2 style={{ marginTop: "2rem" }}>My Applications</h2>
      {applications.length === 0 ? (
        <div className="empty-state">
          No applications yet. <Link to="/jobs">Browse jobs</Link> to get started.
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Job</th>
                <th>Applied</th>
                <th>Status</th>
                <th>AI Match</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id}>
                  <td>
                    <Link to={`/jobs/${app.job_id}`}>
                      {app.job?.title || `Job #${app.job_id}`}
                    </Link>
                  </td>
                  <td>{new Date(app.applied_at).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge status-${app.status}`}>{app.status}</span>
                  </td>
                  <td>
                    {app.ai_match_score != null
                      ? <span className="match-score">{app.ai_match_score}%</span>
                      : "—"}
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
