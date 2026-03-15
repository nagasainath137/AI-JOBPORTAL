import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { jobsService } from "../services/jobsService";

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: "", category: "", location: "" });

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.category) params.category = filters.category;
      if (filters.location) params.location = filters.location;
      const res = await jobsService.list(params);
      setJobs(res.data);
    } catch (err) {
      console.error("Failed to fetch jobs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  return (
    <div className="page-container">
      <div className="jobs-header">
        <h1>Find Your Next Role</h1>
        <p>{jobs.length} active positions</p>
      </div>

      {/* search bar */}
      <form onSubmit={handleSearch} className="search-bar">
        <input
          type="text"
          placeholder="Job title or keyword..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        <input
          type="text"
          placeholder="Category"
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        />
        <input
          type="text"
          placeholder="Location"
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
        />
        <button type="submit" className="btn-primary">Search</button>
      </form>

      {loading ? (
        <div className="loading-state">Loading jobs...</div>
      ) : jobs.length === 0 ? (
        <div className="empty-state">No jobs found. Try adjusting your filters.</div>
      ) : (
        <div className="jobs-grid">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}

function JobCard({ job }) {
  const tags = job.tags ? job.tags.split(",").map((t) => t.trim()) : [];

  return (
    <Link to={`/jobs/${job.id}`} className="job-card">
      <div className="job-card-header">
        <h3>{job.title}</h3>
        <span className={`status-badge status-${job.status}`}>{job.status}</span>
      </div>
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
      <p className="job-card-desc">
        {job.description.slice(0, 140)}...
      </p>
      {tags.length > 0 && (
        <div className="job-tags">
          {tags.slice(0, 4).map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      )}
    </Link>
  );
}
