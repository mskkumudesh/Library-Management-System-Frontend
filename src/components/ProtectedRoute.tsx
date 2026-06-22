import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../app/store";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const token = useAppSelector((s) => s.auth.token);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
