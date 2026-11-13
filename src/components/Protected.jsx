import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export function UserRoute({ children }) { const { user, ready } = useAuth(); if (!ready) return <div className="loading">Loading…</div>; return user?.role === "user" ? children : <Navigate to="/login" replace/>; }
export function AdminRoute({ children }) { const { user, ready } = useAuth(); if (!ready) return <div className="loading">Loading…</div>; return user?.role === "admin" ? children : <Navigate to="/admin/login" replace/>; }
