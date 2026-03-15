import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// roles: optional array of allowed roles e.g. ['recruiter', 'admin']
export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="loading-screen">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;

  return children;
}
