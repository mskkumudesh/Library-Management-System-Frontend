import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../app/store";
import ChatWidget from "../features/chat/ChatWidget";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const token = useAppSelector((s) => s.auth.token);
  const user = useAppSelector((s) => s.auth.user);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      {children}
      {user?.role === "member" && <ChatWidget />}
    </>
  );
}