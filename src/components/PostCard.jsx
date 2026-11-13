import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, MessageCircle, Flag, Trash2, MoreHorizontal, Pencil, X } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Avatar from "./Avatar";
export default function PostCard({ post, onChange }) {
 const { user }=useAuth(); const [comment,setComment]=useState(""); const [busy,setBusy]=useState(false); const [editing,setEditing]=useState(false); const [editText,setEditText]=useState(post.text||"");
 const liked=post.likes?.includes(user?._id)||post.likes?.some(x=>x._id===user?._id); const mine=post.author?._id===user?._id;
 const act=async fn=>{if(busy)return;setBusy(true);try{await fn();onChange?.();}catch(e){alert(e.response?.data?.message||"Action failed");}finally{setBusy(false);}};
 const remove=()=>{if(confirm("Delete your post?"))act(()=>api.delete(`/posts/${post._id}`));};
 return <article className="post card"><div className="post-head"><Link to={`/members/${post.author?._id}`}><Avatar user={post.author}/></Link><div className="post-author"><Link to={`/members/${post.author?._id}`} className="post-author-name">{post.author?.name||"Member"}</Link><small>{post.author?.headline||"NEXORA member"}</small><small>@{post.author?.username||"member"} · {new Date(post.createdAt).toLocaleString()}</small></div><div className="post-menu">{mine&&<><button className="icon-btn" title="Edit post" onClick={()=>setEditing(!editing)}><Pencil size={16}/></button><button className="icon-btn danger-icon" title="Delete post" onClick={remove}><Trash2 size={16}/></button></>}<button className="icon-btn" title="Report post" onClick={()=>{const reason=prompt("Why are you reporting this post?");if(reason)act(()=>api.post("/reports",{postId:post._id,reason}));}}><Flag size={16}/></button></div></div>
 {editing&&<div className="post-edit"><textarea value={editText} maxLength="3000" onChange={e=>setEditText(e.target.value)}/><button className="btn btn-small" onClick={()=>act(async()=>{await api.patch(`/posts/${post._id}`,{text:editText});setEditing(false);})}>Save edit</button><button className="icon-btn" onClick={()=>setEditing(false)}><X size={16}/></button></div>}
 {post.text&&<p className="post-text">{post.text}</p>}{post.imageUrl&&<img className="post-image" src={post.imageUrl} alt="Post attachment" onError={e=>e.currentTarget.style.display="none"}/>}
 <div className="post-stats"><span>{post.likes?.length||0} likes</span><span>{post.comments?.length||0} comments</span></div><div className="post-actions"><button disabled={busy} onClick={()=>act(()=>api.post(`/posts/${post._id}/like`))}><Heart size={18} fill={liked?"currentColor":"none"}/> {liked?"Liked":"Like"}</button><button onClick={()=>document.getElementById(`comment-${post._id}`)?.focus()}><MessageCircle size={18}/> Comment</button></div>
 <div className="comment-form"><input id={`comment-${post._id}`} value={comment} onChange={e=>setComment(e.target.value)} placeholder="Write a comment…"/><button className="btn btn-small" disabled={!comment.trim()||busy} onClick={()=>act(async()=>{await api.post(`/posts/${post._id}/comments`,{text:comment});setComment("");})}>Send</button></div>
 {post.comments?.slice(-5).map((c,i)=><div className="comment" key={c._id||i}><Avatar user={c.author} size="tiny"/><span><Link to={`/members/${c.author?._id}`}><b>{c.author?.name||"Member"}</b></Link> {c.text}</span></div>)}
 </article>;
}
