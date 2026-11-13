import { Routes, Route, Navigate } from "react-router-dom";
import Nav from "./components/Nav";
import { UserRoute, AdminRoute } from "./components/Protected";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import { useAuth } from "./context/AuthContext";
export default function App() {
 const {user}=useAuth();
 return <><Nav/><Routes>
  <Route path="/" element={user?.role==="admin"?<Navigate to="/admin"/>:user?.role==="user"?<Navigate to="/feed"/>:<Landing/>}/>
  <Route path="/login" element={<Auth/>}/><Route path="/register" element={<Auth mode="register"/>}/>
  <Route path="/admin/login" element={<Auth admin/>}/>
  <Route path="/feed" element={<UserRoute><Feed/></UserRoute>}/>
  <Route path="/profile" element={<UserRoute><Profile/></UserRoute>}/>
  <Route path="/members/:id" element={<UserRoute><Profile/></UserRoute>}/>
  <Route path="/admin" element={<AdminRoute><Admin/></AdminRoute>}/>
  <Route path="*" element={<Navigate to="/"/>}/>
 </Routes></>;
}
