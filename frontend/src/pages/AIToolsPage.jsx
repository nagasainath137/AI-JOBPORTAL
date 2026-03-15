import { useState } from "react";
import { aiService } from "../services/jobsService";

const TABS = ["Resume Match", "Cover Letter", "Skill Gap"];

export default function AIToolsPage() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="page-container">
      <div className="ai-tools-header">
        <h1>✨ AI Career Tools</h1>
        <p className="text-muted">Powered by GPT-4o-mini — paste your resume and a job description to get started</p>
      </div>

      <div className="tab-bar">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === i ? "tab-active" : ""}`}
            onClick={() => setActiveTab(i)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {activeTab === 0 && <ResumeMatchTool />}
        {activeTab === 1 && <CoverLetterTool />}
        {activeTab === 2 && <SkillGapTool />}
      </div>
    </div>
  );
}

// ── Resume Match ──────────────────────────────────────────────────────────────
function ResumeMatchTool() {
  const [resumeText, setResumeText] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const run = async () => {
    if (!resumeText || !jobDesc) return;
    setLoading(true);
    setError("");
    try {
      const res = await aiService.matchResume({ resume_text: resumeText, job_description: jobDesc });
      setResult(res.data);
    } catch (err) {
      setError("Analysis failed. Check your API key and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-tool">
      <div className="ai-inputs">
        <div className="form-group">
          <label>Your Resume (paste text)</label>
          <textarea rows={10} value={resumeText} onChange={(e) => setResumeText(e.target.value)} placeholder="Paste your resume content here..." />
        </div>
        <div className="form-group">
          <label>Job Description</label>
          <textarea rows={10} value={jobDesc} onChange={(e) => setJobDesc(e.target.value)} placeholder="Paste the job description here..." />
        </div>
      </div>
      <button className="btn-primary" onClick={run} disabled={loading || !resumeText || !jobDesc}>
        {loading ? "Analyzing..." : "Analyze Match"}
      </button>
      {error && <div className="alert alert-error">{error}</div>}
      {result && (
        <div className="ai-result">
          <div className="match-score-big">
            <span>{result.match_percentage}%</span>
            <label>Match Score</label>
          </div>
          <div className="result-section">
            <h3>Missing Skills</h3>
            <ul>{result.missing_skills.map((s) => <li key={s}>{s}</li>)}</ul>
          </div>
          <div className="result-section">
            <h3>Suggestions</h3>
            <ul>{result.suggestions.map((s) => <li key={s}>{s}</li>)}</ul>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Cover Letter ──────────────────────────────────────────────────────────────
function CoverLetterTool() {
  const [resumeText, setResumeText] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [name, setName] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const run = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await aiService.coverLetter({
        resume_text: resumeText,
        job_description: jobDesc,
        applicant_name: name,
      });
      setResult(res.data.cover_letter);
    } catch {
      setError("Generation failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-tool">
      <div className="ai-inputs">
        <div className="form-group">
          <label>Your Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Smith" />
        </div>
        <div className="form-group">
          <label>Your Resume (paste text)</label>
          <textarea rows={8} value={resumeText} onChange={(e) => setResumeText(e.target.value)} placeholder="Paste your resume..." />
        </div>
        <div className="form-group">
          <label>Job Description</label>
          <textarea rows={8} value={jobDesc} onChange={(e) => setJobDesc(e.target.value)} placeholder="Paste the job description..." />
        </div>
      </div>
      <button className="btn-primary" onClick={run} disabled={loading || !resumeText || !jobDesc || !name}>
        {loading ? "Generating..." : "Generate Cover Letter"}
      </button>
      {error && <div className="alert alert-error">{error}</div>}
      {result && (
        <div className="ai-result">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3>Your Cover Letter</h3>
            <button className="btn-sm" onClick={() => navigator.clipboard.writeText(result)}>Copy</button>
          </div>
          <pre className="cover-letter-output">{result}</pre>
        </div>
      )}
    </div>
  );
}

// ── Skill Gap ─────────────────────────────────────────────────────────────────
function SkillGapTool() {
  const [resumeText, setResumeText] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const run = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await aiService.skillGap({ resume_text: resumeText, job_description: jobDesc });
      setResult(res.data);
    } catch {
      setError("Analysis failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-tool">
      <div className="ai-inputs">
        <div className="form-group">
          <label>Your Resume (paste text)</label>
          <textarea rows={10} value={resumeText} onChange={(e) => setResumeText(e.target.value)} placeholder="Paste your resume..." />
        </div>
        <div className="form-group">
          <label>Job Description</label>
          <textarea rows={10} value={jobDesc} onChange={(e) => setJobDesc(e.target.value)} placeholder="Paste the job description..." />
        </div>
      </div>
      <button className="btn-primary" onClick={run} disabled={loading || !resumeText || !jobDesc}>
        {loading ? "Analyzing..." : "Analyze Skill Gap"}
      </button>
      {error && <div className="alert alert-error">{error}</div>}
      {result && (
        <div className="ai-result">
          <div className="result-section">
            <h3>✅ Your Current Skills</h3>
            <div className="skill-chips">
              {result.current_skills.map((s) => <span key={s} className="chip chip-green">{s}</span>)}
            </div>
          </div>
          <div className="result-section">
            <h3>❌ Missing Skills</h3>
            <div className="skill-chips">
              {result.missing_skills.map((s) => <span key={s} className="chip chip-red">{s}</span>)}
            </div>
          </div>
          <div className="result-section">
            <h3>📚 Recommended Resources</h3>
            <ul>{result.recommended_resources.map((r) => <li key={r}>{r}</li>)}</ul>
          </div>
        </div>
      )}
    </div>
  );
}
