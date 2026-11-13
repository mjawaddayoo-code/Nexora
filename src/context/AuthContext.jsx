import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!localStorage.getItem("nexora_token")) { setReady(true); return; }
    api.get("/auth/me").then(r => setUser(r.data.user)).catch(() => localStorage.removeItem("nexora_token")).finally(() => setReady(true));
  }, []);
  const login = async (email, password, admin = false) => {
    const { data } = await api.post(admin ? "/admin/login" : "/auth/login", { email, password });
    localStorage.setItem("nexora_token", data.token); setUser(data.user); return data.user;
  };
  const register = async values => {
    const { data } = await api.post("/auth/register", values);
    localStorage.setItem("nexora_token", data.token); setUser(data.user); return data.user;
  };
  const logout = () => { localStorage.removeItem("nexora_token"); setUser(null); };
  return <AuthContext.Provider value={{ user, ready, login, register, logout, setUser }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
