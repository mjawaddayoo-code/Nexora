export default function Avatar({ user, size = "normal", className = "" }) {
  return <div className={`avatar avatar-${size} ${className}`}>{user?.avatar ? <img src={user.avatar} alt={`${user.name || "Member"} profile`} /> : (user?.name?.trim()?.[0] || "U").toUpperCase()}</div>;
}
