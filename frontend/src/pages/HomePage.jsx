import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">AI-Powered Job Platform</div>
          <h1>
            Find your next role <br />
            <span className="gradient-text">smarter, faster.</span>
          </h1>
          <p>
            HireAI matches your resume to jobs with AI, generates cover letters in seconds,
            and shows you exactly what skills you need to land the job.
          </p>
          <div className="hero-cta">
            {user ? (
              <Link to="/dashboard" className="btn-primary btn-lg">Go to Dashboard</Link>
            ) : (
              <>
                <Link to="/register" className="btn-primary btn-lg">Get Started Free</Link>
                <Link to="/jobs" className="btn-ghost btn-lg">Browse Jobs</Link>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="features">
        <h2>Everything you need to get hired</h2>
        <div className="features-grid">
          <FeatureCard
            icon="🎯"
            title="Resume Match Score"
            desc="Paste your resume and a job description. Our AI scores your fit and lists exactly what's missing."
          />
          <FeatureCard
            icon="✍️"
            title="Cover Letter Generator"
            desc="Stop staring at a blank page. Generate a tailored, professional cover letter in under 10 seconds."
          />
          <FeatureCard
            icon="📊"
            title="Skill Gap Analyzer"
            desc="Know what to learn next. Get a personalized skill roadmap for any role you're targeting."
          />
          <FeatureCard
            icon="🔍"
            title="Smart Job Search"
            desc="Filter by title, category, location, and salary. Real jobs from real recruiters."
          />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="feature-card">
      <span className="feature-icon">{icon}</span>
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  );
}
