import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">
          <span className="brand-icon">⚡</span> HireAI
        </Link>
      </div>

      <div className="navbar-links">
        <Link to="/jobs">Browse Jobs</Link>

        {user ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/profile">Profile</Link>
            {(user.role === "recruiter" || user.role === "admin") && (
              <Link to="/jobs/new">Post a Job</Link>
            )}
            <div className="navbar-user">
              <span className="user-name">{user.full_name}</span>
              <span className="user-role-badge">{user.role}</span>
              <button onClick={handleLogout} className="btn-ghost">
                Logout
              </button>
            </div>
          </>
        ) : (
          <div className="navbar-auth">
            <Link to="/login" className="btn-ghost">Login</Link>
            <Link to="/register" className="btn-primary">Sign Up</Link>
          </div>
        )}
      </div>
    </nav>
  );
}