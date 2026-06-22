import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../app/store";
import { UserRole } from "../features/auth/authSlice";

export default function RoleRoute({
  allow,
  children,
}: {
  allow: UserRole[];
  children: ReactNode;
}) {
  const user = useAppSelector((s) => s.auth.user);

  if (!user || !allow.includes(user.role)) {
    return <Navigate to="/books" replace />;
  }

  return <>{children}</>;
}
