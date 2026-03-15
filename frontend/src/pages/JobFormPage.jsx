import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { jobsService } from "../services/jobsService";

// used for both create and edit
export default function JobFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    salary_min: "",
    salary_max: "",
    tags: "",
    status: "draft",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    jobsService.get(id).then((res) => {
      const j = res.data;
      setForm({
        title: j.title,
        description: j.description,
        category: j.category || "",
        location: j.location || "",
        salary_min: j.salary_min || "",
        salary_max: j.salary_max || "",
        tags: j.tags || "",
        status: j.status,
      });
    });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const payload = {
      ...form,
      salary_min: form.salary_min ? parseFloat(form.salary_min) : null,
      salary_max: form.salary_max ? parseFloat(form.salary_max) : null,
    };
    try {
      if (isEdit) {
        await jobsService.update(id, payload);
      } else {
        await jobsService.create(payload);
      }
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to save job");
    } finally {
      setLoading(false);
    }
  };

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div className="page-container" style={{ maxWidth: "720px" }}>
      <h1>{isEdit ? "Edit Job Posting" : "Post a New Job"}</h1>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label>Job Title *</label>
          <input type="text" value={form.title} onChange={set("title")} required placeholder="e.g. Senior Frontend Engineer" />
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea rows={10} value={form.description} onChange={set("description")} required placeholder="Describe the role, responsibilities, requirements..." />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Category</label>
            <input type="text" value={form.category} onChange={set("category")} placeholder="e.g. Engineering" />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input type="text" value={form.location} onChange={set("location")} placeholder="e.g. Remote / New York" />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Min Salary (USD)</label>
            <input type="number" value={form.salary_min} onChange={set("salary_min")} placeholder="60000" />
          </div>
          <div className="form-group">
            <label>Max Salary (USD)</label>
            <input type="number" value={form.salary_max} onChange={set("salary_max")} placeholder="90000" />
          </div>
        </div>

        <div className="form-group">
          <label>Tags (comma-separated)</label>
          <input type="text" value={form.tags} onChange={set("tags")} placeholder="React, TypeScript, Node.js" />
        </div>

        <div className="form-group">
          <label>Status</label>
          <select value={form.status} onChange={set("status")}>
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          <button type="button" className="btn-ghost" onClick={() => navigate(-1)}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Saving..." : isEdit ? "Update Job" : "Post Job"}
          </button>
        </div>
      </form>
    </div>
  );
}
