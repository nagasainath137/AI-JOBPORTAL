import { useState, useEffect } from "react";
import { profileService } from "../services/jobsService";
import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();
  const [form, setForm] = useState({ full_name: "", bio: "", location: "" });
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");
  const [saveMsg, setSaveMsg] = useState("");

  useEffect(() => {
    if (!user) return;
    setForm({ full_name: user.full_name, bio: user.bio || "", location: user.location || "" });
    profileService.getSkills().then((res) => setSkills(res.data));
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await profileService.update(form);
      setSaveMsg("Profile saved!");
      setTimeout(() => setSaveMsg(""), 3000);
    } catch {
      setSaveMsg("Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleResume = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadMsg("Uploading...");
    try {
      await profileService.uploadResume(file);
      setUploadMsg("Resume uploaded ✓");
    } catch (err) {
      setUploadMsg(err.response?.data?.detail || "Upload failed");
    }
  };

  const handleAddSkill = async () => {
    if (!newSkill.trim()) return;
    try {
      await profileService.addSkill(newSkill.trim());
      const res = await profileService.getSkills();
      setSkills(res.data);
      setNewSkill("");
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to add skill");
    }
  };

  const handleRemoveSkill = async (name) => {
    await profileService.removeSkill(name);
    setSkills((prev) => prev.filter((s) => s.name !== name));
  };

  return (
    <div className="page-container" style={{ maxWidth: "720px" }}>
      <h1>My Profile</h1>

      <form onSubmit={handleSave} className="auth-form">
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            placeholder="e.g. San Francisco, CA"
          />
        </div>
        <div className="form-group">
          <label>Bio</label>
          <textarea
            rows={4}
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            placeholder="Brief professional summary..."
          />
        </div>
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? "Saving..." : "Save Profile"}
        </button>
        {saveMsg && <span className="text-muted" style={{ marginLeft: "1rem" }}>{saveMsg}</span>}
      </form>

      {user?.role === "candidate" && (
        <>
          <hr className="section-divider" />
          <h2>Resume</h2>
          <div className="resume-upload">
            <label className="upload-label">
              <input type="file" accept=".pdf" onChange={handleResume} hidden />
              <span className="btn-outline">Upload PDF Resume</span>
            </label>
            {uploadMsg && <span className="text-muted">{uploadMsg}</span>}
            {user.resume_path && (
              <a
                href={`${process.env.REACT_APP_API_URL}/${user.resume_path}`}
                target="_blank"
                rel="noreferrer"
                className="btn-sm"
              >
                View Current Resume
              </a>
            )}
          </div>

          <hr className="section-divider" />
          <h2>Skills</h2>
          <div className="skills-section">
            <div className="skill-chips">
              {skills.map((s) => (
                <span key={s.id} className="chip chip-blue">
                  {s.name}
                  <button onClick={() => handleRemoveSkill(s.name)} className="chip-remove">×</button>
                </span>
              ))}
            </div>
            <div className="add-skill">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill..."
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSkill())}
              />
              <button type="button" className="btn-primary" onClick={handleAddSkill}>Add</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
