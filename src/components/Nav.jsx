import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut, Network } from "lucide-react";
import Avatar from "./Avatar";
export default function Nav() {
  const { user, logout } = useAuth(); const nav = useNavigate();
  return <header className="topbar"><Link className="brand" to="/"><span className="brand-icon"><Network size={21}/></span>NEXORA</Link>
    <nav>{user?.role === "user" && <Link to="/feed">Feed</Link>}{user?.role === "user" && <Link to="/profile">Profile</Link>}{user?.role === "admin" && <Link to="/admin">Dashboard</Link>}</nav>
    <div className="nav-right">{user ? <><Link to={user.role === "user" ? "/profile" : "/admin"} className="nav-user"><Avatar user={user} size="tiny"/><span className="nav-name">{user.name}</span></Link><button className="icon-btn" onClick={() => { logout(); nav("/"); }} title="Logout"><LogOut size={18}/></button></> : <><Link to="/login">Log in</Link><Link className="btn btn-small" to="/register">Join now</Link></>}</div>
  </header>;
}
