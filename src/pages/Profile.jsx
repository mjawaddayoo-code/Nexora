import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Camera, MapPin, CalendarDays, Edit3, ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import Avatar from "../components/Avatar";
import PostCard from "../components/PostCard";

const readImage = file => new Promise((resolve, reject) => {
  if (!file) return resolve("");
  if (!file.type.startsWith("image/")) return reject(new Error("Please choose an image file."));
  if (file.size > 1.5 * 1024 * 1024) return reject(new Error("Image must be smaller than 1.5 MB."));
  const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = () => reject(new Error("Could not read image.")); reader.readAsDataURL(file);
});

export default function Profile() {
  const { id } = useParams(); const { user: me, setUser } = useAuth();
  const own = !id || id === me?._id;
  const [profile, setProfile] = useState(own ? me : null);
  const [posts, setPosts] = useState([]); const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", username: "", headline: "", bio: "", avatar: "" });
  const [message, setMessage] = useState(""); const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  const load = async () => {
    try {
      if (own) { const p = me; setProfile(p); setForm({ name:p?.name||"", username:p?.username||"", headline:p?.headline||"", bio:p?.bio||"", avatar:p?.avatar||"" }); const r=await api.get("/posts",{params:{author:p?._id}}); setPosts(r.data); }
      else { const r=await api.get(`/auth/members/${id}`); setProfile(r.data.user); setPosts(r.data.posts); }
    } catch(e) { setError(e.response?.data?.message || "Could not load this profile."); }
  };
  useEffect(()=>{load();},[id, me?._id]);
  const save = async e => { e.preventDefault(); setBusy(true); setError(""); setMessage(""); try { const {data}=await api.patch("/auth/profile",form); setUser(data.user); setProfile(data.user); setEditing(false); setMessage("Your profile has been updated."); } catch(e) { setError(e.response?.data?.message||"Could not save profile."); } finally { setBusy(false); } };
  const chooseAvatar = async e => { try { const avatar=await readImage(e.target.files?.[0]); setForm(f=>({...f,avatar})); } catch(err) { setError(err.message); } };
  if (error && !profile) return <main className="profile-page card"><p>{error}</p><Link to="/feed">Back to feed</Link></main>;
  if (!profile) return <div className="loading">Loading profile…</div>;
  return <main className="member-page">
    <Link className="back-link" to="/feed"><ArrowLeft size={16}/> Back to feed</Link>
    <section className="member-hero card"><div className="member-cover"/><div className="member-info"><Avatar user={profile} size="xl"/><div className="member-actions">{own ? <button className="btn btn-outline" onClick={()=>{setEditing(!editing);setMessage("");}}><Edit3 size={16}/>{editing?"Close editor":"Edit profile"}</button>:<span className="member-label">NEXORA MEMBER</span>}</div>
      <h1>{profile.name}</h1><p className="member-handle">@{profile.username || "nexora-member"}</p><p className="member-headline">{profile.headline || "NEXORA member"}</p>
      <div className="member-meta"><span><MapPin size={15}/> NEXORA Community</span><span><CalendarDays size={15}/> Joined {new Date(profile.createdAt).toLocaleDateString(undefined,{month:"long",year:"numeric"})}</span></div>
      {profile.bio && <div className="member-bio"><h3>About</h3><p>{profile.bio}</p></div>}
    </div></section>
    {editing && own && <section className="profile-editor card"><div className="editor-heading"><div><span className="eyebrow">PROFILE SETTINGS</span><h2>Edit your introduction</h2></div></div><form onSubmit={save}>
      <div className="avatar-edit-row"><Avatar user={{...profile,avatar:form.avatar,name:form.name}} size="lg"/><label className="upload-control"><Camera size={16}/> Change profile photo<input type="file" accept="image/*" onChange={chooseAvatar}/></label><small>JPG, PNG or WEBP · max 1.5 MB</small></div>
      <div className="profile-form-grid"><label>Full name<input required maxLength="80" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label><label>Username<input required minLength="3" maxLength="30" value={form.username} onChange={e=>setForm({...form,username:e.target.value.replace(/^@/,"")})}/><small>3–30 characters: letters, numbers, dot or underscore</small></label><label className="full-field">Headline<input maxLength="140" value={form.headline} onChange={e=>setForm({...form,headline:e.target.value})} placeholder="What do you do?"/></label><label className="full-field">About / Bio<textarea maxLength="1000" rows="5" value={form.bio} onChange={e=>setForm({...form,bio:e.target.value})} placeholder="Tell people about yourself, your skills and interests…"/></label></div>
      <div className="editor-footer"><span>{message||error}</span><button className="btn" disabled={busy}>{busy?"Saving…":"Save profile"}</button></div>
    </form></section>}
    {error && profile && <div className="alert">{error}</div>}
    <section className="member-posts"><div className="member-post-heading"><div><span className="eyebrow">COMMUNITY ACTIVITY</span><h2>{own?"Your posts":`${profile.name.split(" ")[0]}'s posts`}</h2></div><span>{posts.length} {posts.length===1?"post":"posts"}</span></div>{posts.map(p=><PostCard key={p._id} post={p} onChange={load}/>)}{!posts.length&&<div className="empty card">No posts shared yet.</div>}</section>
  </main>;
}
