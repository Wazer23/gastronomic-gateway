import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

export const RequireAuth = ({ children, manager = false }: { children: ReactNode; manager?: boolean }) => {
  const { user, loading, isTeam, isManager } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/admin/login" state={{ from: location }} replace />;
  if (!isTeam) return <Navigate to="/admin/no-access" replace />;
  if (manager && !isManager) return <Navigate to="/admin" replace />;

  return <>{children}</>;
};