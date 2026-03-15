import { useAuth } from "../context/AuthContext";
import RecruiterDashboard from "./RecruiterDashboard";
import CandidateDashboard from "./CandidateDashboard";

export default function DashboardPage() {
  const { user } = useAuth();

  if (user?.role === "recruiter" || user?.role === "admin") {
    return <RecruiterDashboard />;
  }
  return <CandidateDashboard />;
}
