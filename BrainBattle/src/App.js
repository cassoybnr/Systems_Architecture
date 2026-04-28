import { useState, useEffect, useCallback } from "react";

// ─── Tokens ───────────────────────────────────────────────────────────────────
const C = {
  bg:"#080c18", bgCard:"#0f1625", bgCardAlt:"#141d2e",
  border:"#1a2540", borderL:"#253050",
  purple:"#7c3aed", purpleL:"#a855f7", purpleD:"#5b21b6",
  green:"#10b981", greenL:"#34d399", cyan:"#06b6d4",
  text:"#f0f4ff", textMuted:"#8896b3", textDim:"#4a5878",
  orange:"#f97316", pink:"#ec4899", red:"#ef4444", gold:"#f59e0b",
};

const G = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;600;700;800;900&family=Barlow+Condensed:wght@700;800;900&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  html,body,#root{height:100%;}
  body{background:${C.bg};color:${C.text};font-family:'Barlow',sans-serif;-webkit-font-smoothing:antialiased;}
  ::-webkit-scrollbar{width:5px;}
  ::-webkit-scrollbar-track{background:${C.bg};}
  ::-webkit-scrollbar-thumb{background:${C.border};border-radius:99px;}
  button{cursor:pointer;border:none;outline:none;font-family:inherit;background:none;}
  input{font-family:inherit;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
  @keyframes glow{0%,100%{box-shadow:0 0 18px rgba(124,58,237,.45)}50%{box-shadow:0 0 36px rgba(124,58,237,.9)}}
  @keyframes glowGreen{0%,100%{box-shadow:0 0 18px rgba(16,185,129,.3)}50%{box-shadow:0 0 36px rgba(16,185,129,.7)}}
  @keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-7px)}40%{transform:translateX(7px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}}
  @keyframes slideIn{from{opacity:0;transform:translateX(28px)}to{opacity:1;transform:none}}
  @keyframes heartbeat{0%,100%{transform:scale(1)}15%{transform:scale(1.3)}30%{transform:scale(1)}}
  @keyframes correctPop{0%{transform:scale(1)}40%{transform:scale(1.04)}100%{transform:scale(1)}}
  .fade-up{animation:fadeUp .45s cubic-bezier(.22,1,.36,1) both;}
  .fade-in{animation:fadeIn .3s ease both;}
  .slide-in{animation:slideIn .4s cubic-bezier(.22,1,.36,1) both;}
  .btn-primary{background:linear-gradient(135deg,${C.purple},${C.purpleL});color:#fff;padding:14px 28px;border-radius:10px;font-size:15px;font-weight:700;letter-spacing:.4px;transition:transform .15s,box-shadow .15s;}
  .btn-primary:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(124,58,237,.55);}
  .btn-primary:active{transform:translateY(0);}
  .btn-green{background:linear-gradient(135deg,${C.green},${C.cyan});color:#fff;padding:14px 28px;border-radius:10px;font-size:15px;font-weight:700;transition:transform .15s,box-shadow .15s;}
  .btn-green:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(16,185,129,.5);}
  .btn-outline{background:transparent;border:1.5px solid ${C.border};color:${C.text};padding:14px 28px;border-radius:10px;font-size:15px;font-weight:600;transition:border-color .15s,background .15s,transform .15s;}
  .btn-outline:hover{border-color:${C.purple};background:rgba(124,58,237,.08);transform:translateY(-2px);}
  .card{background:${C.bgCard};border:1px solid ${C.border};border-radius:14px;}
  .page-in{animation:fadeIn .28s ease both;}
  .input-field{width:100%;background:${C.bgCardAlt};border:1.5px solid ${C.border};border-radius:10px;padding:13px 16px;color:${C.text};font-size:15px;font-weight:500;outline:none;transition:border-color .2s;}
  .input-field:focus{border-color:${C.purple};}
  .input-field::placeholder{color:${C.textDim};}
`;

// ─── Atoms ────────────────────────────────────────────────────────────────────
const Badge = ({ children, color = C.green, style: s = {} }) => (
  <span style={{ display:"inline-flex", alignItems:"center", gap:6, background:`${color}18`, border:`1px solid ${color}44`, color, borderRadius:100, padding:"5px 14px", fontSize:11, fontWeight:800, letterSpacing:1, textTransform:"uppercase", ...s }}>{children}</span>
);

const Dot = ({ color = C.green }) => (
  <span style={{ width:7, height:7, borderRadius:"50%", background:color, display:"inline-block", animation:"pulse 1.5s infinite" }}/>
);

function Avatar({ size = 36, children, color }) {
  return (
    <div style={{ width:size, height:size, borderRadius:"50%", flexShrink:0, background:color || `linear-gradient(135deg,${C.purple},${C.cyan})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:size*.38, fontWeight:800, color:"#fff" }}>
      {children}
    </div>
  );
}

function Footer() {
  return (
    <footer style={{ borderTop:`1px solid ${C.border}`, padding:"28px 32px", textAlign:"center" }}>
      <div style={{ fontWeight:800, fontSize:14, marginBottom:10 }}>BrainBattle Arena</div>
      <div style={{ display:"flex", gap:24, justifyContent:"center", color:C.textMuted, fontSize:12, marginBottom:10 }}>
        {["Privacy Policy","Terms of Service","Support"].map(l => <span key={l} style={{ cursor:"pointer" }}>{l}</span>)}
      </div>
      <div style={{ color:C.textDim, fontSize:11 }}>© 2024 BrainBattle Arena. All Rights Reserved.</div>
    </footer>
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────────────
function Nav({ active, onNavigate, user, onLogout, minimal }) {
  const [dropOpen, setDropOpen] = useState(false);
  return (
    <nav style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 32px", height:62, background:"rgba(8,12,24,.92)", backdropFilter:"blur(16px)", borderBottom:`1px solid ${C.border}`, position:"sticky", top:0, zIndex:200 }}>
      <button onClick={() => onNavigate("home")} style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:22, fontWeight:900, color:C.purpleL, letterSpacing:.5 }}>
        BrainBattle
      </button>

      {!minimal && (
        <div style={{ display:"flex", gap:28 }}>
          {["arena","leaderboard","training"].map(l => (
            <button key={l} onClick={() => onNavigate(l)}
              style={{ color:active===l?C.purpleL:C.textMuted, fontSize:12, fontWeight:800, letterSpacing:1.2, textTransform:"uppercase", borderBottom:active===l?`2px solid ${C.purpleL}`:"2px solid transparent", paddingBottom:2, transition:"color .15s" }}
              onMouseEnter={e=>{ if(active!==l) e.currentTarget.style.color=C.text; }}
              onMouseLeave={e=>{ if(active!==l) e.currentTarget.style.color=C.textMuted; }}>
              {l}
            </button>
          ))}
        </div>
      )}

      <div style={{ display:"flex", gap:12, alignItems:"center" }}>
        {user ? (
          <div style={{ position:"relative" }}>
            <button onClick={() => setDropOpen(v=>!v)}
              style={{ display:"flex", alignItems:"center", gap:10, padding:"6px 10px", borderRadius:10, border:`1px solid ${C.border}`, transition:"border-color .15s" }}
              onMouseEnter={e=>e.currentTarget.style.borderColor=C.purple}
              onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
              <Avatar size={30} color={user.avatarColor}>{user.initials}</Avatar>
              <span style={{ fontSize:13, fontWeight:700 }}>{user.username}</span>
              <span style={{ fontSize:10, color:C.textMuted }}>▾</span>
            </button>
            {dropOpen && (
              <div style={{ position:"absolute", top:"calc(100% + 8px)", right:0, width:180, background:C.bgCard, border:`1px solid ${C.border}`, borderRadius:12, overflow:"hidden", zIndex:300, animation:"fadeIn .15s ease" }}>
                {[
                  { label:"👤  My Profile",   action:"profile" },
                  { label:"🎖  Achievements", action:"achievements" },
                  { label:"⚙️  Settings",     action:"settings" },
                ].map(item => (
                  <button key={item.label} onClick={() => { setDropOpen(false); onNavigate(item.action); }}
                    style={{ width:"100%", padding:"12px 16px", textAlign:"left", fontSize:13, fontWeight:600, color:C.textMuted, transition:"all .15s" }}
                    onMouseEnter={e=>{ e.currentTarget.style.background=C.bgCardAlt; e.currentTarget.style.color=C.text; }}
                    onMouseLeave={e=>{ e.currentTarget.style.background="none"; e.currentTarget.style.color=C.textMuted; }}>
                    {item.label}
                  </button>
                ))}
                <div style={{ borderTop:`1px solid ${C.border}` }}>
                  <button onClick={() => { setDropOpen(false); onLogout(); }}
                    style={{ width:"100%", padding:"12px 16px", textAlign:"left", fontSize:13, fontWeight:600, color:C.red, transition:"background .15s" }}
                    onMouseEnter={e=>e.currentTarget.style.background=C.bgCardAlt}
                    onMouseLeave={e=>e.currentTarget.style.background="none"}>
                    🚪  Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ display:"flex", gap:10 }}>
            <button className="btn-outline" onClick={() => onNavigate("login")} style={{ padding:"9px 20px", fontSize:13 }}>Log In</button>
            <button className="btn-primary" onClick={() => onNavigate("signup")} style={{ padding:"9px 20px", fontSize:13 }}>Sign Up</button>
          </div>
        )}
      </div>
    </nav>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ active, onNavigate, user }) {
  const items = [
    { id:"arena",        icon:"🚀", label:"Battle Now" },
    { id:"quests",       icon:"📋", label:"Quests" },
    { id:"achievements", icon:"🎖", label:"Achievements" },
  ];
  const isActive = (id) => id==="arena" ? ["arena","leaderboard","training","battle"].includes(active) : active===id;
  return (
    <aside style={{ width:214, background:C.bgCard, borderRight:`1px solid ${C.border}`, display:"flex", flexDirection:"column", flexShrink:0 }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, padding:"20px 18px", borderBottom:`1px solid ${C.border}` }}>
        <Avatar size={38} color={user?.avatarColor}>{user?.initials || "👤"}</Avatar>
        <div>
          <div style={{ fontSize:13, fontWeight:700 }}>{user?.username || "Guest"}</div>
          <div style={{ fontSize:11, color:C.green, fontWeight:700 }}>RANK: GOLD III</div>
        </div>
      </div>
      <div style={{ flex:1, padding:"12px 0" }}>
        {items.map(it => {
          const on = isActive(it.id);
          return (
            <button key={it.id} onClick={() => onNavigate(it.id)}
              style={{ width:"100%", display:"flex", alignItems:"center", gap:10, padding:"12px 18px", background:on?"rgba(124,58,237,.14)":"none", borderLeft:on?`3px solid ${C.purple}`:"3px solid transparent", color:on?C.purpleL:C.textMuted, fontSize:13, fontWeight:600, transition:"all .15s" }}
              onMouseEnter={e=>{ if(!on){ e.currentTarget.style.background="rgba(124,58,237,.06)"; e.currentTarget.style.color=C.text; }}}
              onMouseLeave={e=>{ if(!on){ e.currentTarget.style.background="none"; e.currentTarget.style.color=C.textMuted; }}}>
              <span style={{ fontSize:16 }}>{it.icon}</span>{it.label}
            </button>
          );
        })}
      </div>
      <div style={{ padding:"16px" }}>
        <button className="btn-primary" style={{ width:"100%", fontSize:13, padding:"12px" }}>✨ Upgrade to Pro</button>
      </div>
    </aside>
  );
}

function Shell({ active, onNavigate, user, onLogout, children }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100vh", overflow:"hidden" }}>
      <Nav active={active} onNavigate={onNavigate} user={user} onLogout={onLogout} />
      <div style={{ display:"flex", flex:1, overflow:"hidden" }}>
        <Sidebar active={active} onNavigate={onNavigate} user={user} />
        <main style={{ flex:1, overflowY:"auto" }}>{children}</main>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// AUTH – LOGIN
// ══════════════════════════════════════════════════════════════════════════════
function LoginPage({ onNavigate, onLogin }) {
  const [form, setForm] = useState({ email:"", password:"" });
  const [err, setErr]   = useState("");
  const [loading, setLoading] = useState(false);

  const submit = () => {
    setErr("");
    if (!form.email || !form.password) { setErr("Please fill in all fields."); return; }
    setLoading(true);
    // Simulate auth — replace with real API call later
    setTimeout(() => {
      const username = form.email.split("@")[0];
      onLogin({
        username,
        email: form.email,
        initials: username.slice(0,2).toUpperCase(),
        avatarColor:`linear-gradient(135deg,${C.purple},${C.cyan})`,
        level: 24, xp: 3200, streak: 8, wins: 47, losses: 12,
      });
      onNavigate("home");
    }, 900);
  };

  return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ width:"100%", maxWidth:420, padding:"0 24px" }}>
        <div className="fade-up" style={{ textAlign:"center", marginBottom:36 }}>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:28, fontWeight:900, color:C.purpleL, marginBottom:8 }}>BrainBattle</div>
          <h1 style={{ fontSize:26, fontWeight:800, marginBottom:6 }}>Welcome back</h1>
          <p style={{ color:C.textMuted, fontSize:14 }}>Log in to continue your battle</p>
        </div>

        <div className="card fade-up" style={{ padding:"32px 28px", animationDelay:".1s" }}>
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            <div>
              <label style={{ fontSize:12, fontWeight:700, color:C.textMuted, letterSpacing:1, textTransform:"uppercase", display:"block", marginBottom:8 }}>Email</label>
              <input className="input-field" type="email" placeholder="you@example.com"
                value={form.email} onChange={e=>setForm(v=>({...v,email:e.target.value}))}
                onKeyDown={e=>e.key==="Enter"&&submit()} />
            </div>
            <div>
              <label style={{ fontSize:12, fontWeight:700, color:C.textMuted, letterSpacing:1, textTransform:"uppercase", display:"block", marginBottom:8 }}>Password</label>
              <input className="input-field" type="password" placeholder="••••••••"
                value={form.password} onChange={e=>setForm(v=>({...v,password:e.target.value}))}
                onKeyDown={e=>e.key==="Enter"&&submit()} />
            </div>

            {err && <div style={{ background:`${C.red}18`, border:`1px solid ${C.red}44`, color:C.red, borderRadius:8, padding:"10px 14px", fontSize:13 }}>{err}</div>}

            <button className="btn-primary" onClick={submit}
              style={{ width:"100%", marginTop:4, fontSize:15, opacity:loading?.7:1 }}>
              {loading ? "Logging in…" : "Log In"}
            </button>
          </div>

          <div style={{ textAlign:"center", marginTop:20, fontSize:13, color:C.textMuted }}>
            Don't have an account?{" "}
            <button onClick={() => onNavigate("signup")} style={{ color:C.purpleL, fontWeight:700 }}>Sign Up</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// AUTH – SIGN UP
// ══════════════════════════════════════════════════════════════════════════════
const AVATAR_COLORS = [
  `linear-gradient(135deg,${C.purple},${C.cyan})`,
  `linear-gradient(135deg,${C.green},${C.cyan})`,
  `linear-gradient(135deg,${C.orange},${C.pink})`,
  `linear-gradient(135deg,#f59e0b,${C.orange})`,
  `linear-gradient(135deg,${C.pink},${C.purple})`,
  `linear-gradient(135deg,${C.cyan},${C.green})`,
];

function SignupPage({ onNavigate, onLogin }) {
  const [form, setForm]       = useState({ username:"", email:"", password:"", confirm:"" });
  const [avatarIdx, setAvatarIdx] = useState(0);
  const [err, setErr]         = useState("");
  const [loading, setLoading] = useState(false);

  const submit = () => {
    setErr("");
    if (!form.username || !form.email || !form.password || !form.confirm) { setErr("Please fill in all fields."); return; }
    if (form.password !== form.confirm) { setErr("Passwords don't match."); return; }
    if (form.password.length < 6) { setErr("Password must be at least 6 characters."); return; }
    setLoading(true);
    setTimeout(() => {
      onLogin({
        username: form.username,
        email: form.email,
        initials: form.username.slice(0,2).toUpperCase(),
        avatarColor: AVATAR_COLORS[avatarIdx],
        level:1, xp:0, streak:0, wins:0, losses:0,
      });
      onNavigate("home");
    }, 900);
  };

  return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 24px" }}>
      <div style={{ width:"100%", maxWidth:440 }}>
        <div className="fade-up" style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:28, fontWeight:900, color:C.purpleL, marginBottom:8 }}>BrainBattle</div>
          <h1 style={{ fontSize:26, fontWeight:800, marginBottom:6 }}>Create your account</h1>
          <p style={{ color:C.textMuted, fontSize:14 }}>Join 500,000+ players in the arena</p>
        </div>

        <div className="card fade-up" style={{ padding:"32px 28px", animationDelay:".1s" }}>
          {/* Avatar picker */}
          <div style={{ marginBottom:24 }}>
            <label style={{ fontSize:12, fontWeight:700, color:C.textMuted, letterSpacing:1, textTransform:"uppercase", display:"block", marginBottom:12 }}>Choose Avatar Color</label>
            <div style={{ display:"flex", gap:10 }}>
              {AVATAR_COLORS.map((col, i) => (
                <button key={i} onClick={() => setAvatarIdx(i)} style={{
                  width:40, height:40, borderRadius:"50%", background:col,
                  border: avatarIdx===i ? `3px solid ${C.purpleL}` : "3px solid transparent",
                  boxShadow: avatarIdx===i ? `0 0 0 2px ${C.bg}, 0 0 0 4px ${C.purple}` : "none",
                  transition:"all .15s",
                }}/>
              ))}
            </div>
            {form.username && (
              <div style={{ marginTop:12, display:"flex", alignItems:"center", gap:10 }}>
                <Avatar size={40} color={AVATAR_COLORS[avatarIdx]}>{form.username.slice(0,2).toUpperCase()}</Avatar>
                <span style={{ fontSize:13, color:C.textMuted }}>Preview</span>
              </div>
            )}
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {[
              { key:"username", label:"Username",        type:"text",     ph:"YourBattleName" },
              { key:"email",    label:"Email",           type:"email",    ph:"you@example.com" },
              { key:"password", label:"Password",        type:"password", ph:"Min. 6 characters" },
              { key:"confirm",  label:"Confirm Password",type:"password", ph:"Repeat password" },
            ].map(f => (
              <div key={f.key}>
                <label style={{ fontSize:12, fontWeight:700, color:C.textMuted, letterSpacing:1, textTransform:"uppercase", display:"block", marginBottom:8 }}>{f.label}</label>
                <input className="input-field" type={f.type} placeholder={f.ph}
                  value={form[f.key]} onChange={e=>setForm(v=>({...v,[f.key]:e.target.value}))}
                  onKeyDown={e=>e.key==="Enter"&&submit()} />
              </div>
            ))}

            {err && <div style={{ background:`${C.red}18`, border:`1px solid ${C.red}44`, color:C.red, borderRadius:8, padding:"10px 14px", fontSize:13 }}>{err}</div>}

            <button className="btn-primary" onClick={submit} style={{ width:"100%", marginTop:4, fontSize:15, opacity:loading?.7:1 }}>
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </div>

          <div style={{ textAlign:"center", marginTop:20, fontSize:13, color:C.textMuted }}>
            Already have an account?{" "}
            <button onClick={() => onNavigate("login")} style={{ color:C.purpleL, fontWeight:700 }}>Log In</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PROFILE PAGE
// ══════════════════════════════════════════════════════════════════════════════
function ProfilePage({ onNavigate, user, onUpdateUser }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm]       = useState({ username: user?.username || "", email: user?.email || "" });
  const [avatarIdx, setAvatarIdx] = useState(AVATAR_COLORS.indexOf(user?.avatarColor) || 0);
  const [saved, setSaved]     = useState(false);

  const save = () => {
    onUpdateUser({ ...user, username:form.username, email:form.email, avatarColor:AVATAR_COLORS[avatarIdx], initials:form.username.slice(0,2).toUpperCase() });
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const stats = [
    { icon:"🏆", label:"Total Wins",   value: user?.wins    || 0 },
    { icon:"💀", label:"Total Losses", value: user?.losses  || 0 },
    { icon:"🔥", label:"Best Streak",  value: user?.streak  || 0 },
    { icon:"⭐", label:"Level",        value: user?.level   || 1 },
  ];

  const history = [
    { cat:"Quantum Physics", result:"WIN",  score:1850, date:"Today" },
    { cat:"History",         result:"WIN",  score:1420, date:"Yesterday" },
    { cat:"Geography",       result:"LOSS", score:890,  date:"2 days ago" },
    { cat:"Science & Tech",  result:"WIN",  score:2100, date:"3 days ago" },
    { cat:"History",         result:"WIN",  score:1650, date:"4 days ago" },
  ];

  return (
    <div style={{ minHeight:"100vh", background:C.bg }}>
      <Nav active="profile" onNavigate={onNavigate} user={user} onLogout={() => onNavigate("home")} />
      <div style={{ maxWidth:860, margin:"0 auto", padding:"48px 32px 80px" }}>

        {/* Header card */}
        <div className="card fade-up" style={{ padding:"36px 36px", marginBottom:24, display:"flex", alignItems:"center", gap:28 }}>
          <div style={{ position:"relative" }}>
            <Avatar size={88} color={user?.avatarColor || AVATAR_COLORS[avatarIdx]}>{user?.initials}</Avatar>
            <div style={{ position:"absolute", bottom:0, right:0, width:24, height:24, borderRadius:"50%", background:C.green, border:`2px solid ${C.bgCard}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10 }}>✓</div>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:6 }}>
              <h1 style={{ fontSize:28, fontWeight:900 }}>{user?.username}</h1>
              <Badge color={C.gold}>Gold III</Badge>
            </div>
            <div style={{ color:C.textMuted, fontSize:14, marginBottom:12 }}>{user?.email}</div>
            <div style={{ display:"flex", gap:16, alignItems:"center" }}>
              <div style={{ fontSize:12, color:C.textMuted }}>Level {user?.level || 1}</div>
              <div style={{ flex:1, maxWidth:200 }}>
                <div style={{ height:5, background:C.border, borderRadius:99, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:"62%", background:`linear-gradient(90deg,${C.purple},${C.purpleL})`, borderRadius:99 }}/>
                </div>
              </div>
              <div style={{ fontSize:12, color:C.textMuted }}>{user?.xp || 0} XP</div>
            </div>
          </div>
          <button className="btn-outline" onClick={() => setEditing(v=>!v)} style={{ fontSize:13, padding:"10px 20px" }}>
            {editing ? "Cancel" : "✏️ Edit Profile"}
          </button>
        </div>

        {/* Edit form */}
        {editing && (
          <div className="card fade-up" style={{ padding:"28px 36px", marginBottom:24 }}>
            <h3 style={{ fontWeight:800, fontSize:16, marginBottom:20 }}>Edit Profile</h3>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:20 }}>
              <div>
                <label style={{ fontSize:12, fontWeight:700, color:C.textMuted, letterSpacing:1, textTransform:"uppercase", display:"block", marginBottom:8 }}>Username</label>
                <input className="input-field" value={form.username} onChange={e=>setForm(v=>({...v,username:e.target.value}))} />
              </div>
              <div>
                <label style={{ fontSize:12, fontWeight:700, color:C.textMuted, letterSpacing:1, textTransform:"uppercase", display:"block", marginBottom:8 }}>Email</label>
                <input className="input-field" type="email" value={form.email} onChange={e=>setForm(v=>({...v,email:e.target.value}))} />
              </div>
            </div>
            <div style={{ marginBottom:20 }}>
              <label style={{ fontSize:12, fontWeight:700, color:C.textMuted, letterSpacing:1, textTransform:"uppercase", display:"block", marginBottom:12 }}>Avatar Color</label>
              <div style={{ display:"flex", gap:10 }}>
                {AVATAR_COLORS.map((col,i) => (
                  <button key={i} onClick={() => setAvatarIdx(i)} style={{ width:36, height:36, borderRadius:"50%", background:col, border:avatarIdx===i?`3px solid ${C.purpleL}`:"3px solid transparent", boxShadow:avatarIdx===i?`0 0 0 2px ${C.bg},0 0 0 4px ${C.purple}`:"none", transition:"all .15s" }}/>
                ))}
              </div>
            </div>
            <button className="btn-primary" onClick={save} style={{ fontSize:14, padding:"12px 28px" }}>Save Changes</button>
          </div>
        )}

        {saved && (
          <div className="fade-in" style={{ background:`${C.green}18`, border:`1px solid ${C.green}44`, color:C.green, borderRadius:10, padding:"12px 20px", marginBottom:20, fontSize:14, fontWeight:600 }}>
            ✅ Profile updated successfully!
          </div>
        )}

        {/* Stats */}
        <div className="fade-up" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:24, animationDelay:".1s" }}>
          {stats.map(s => (
            <div key={s.label} className="card" style={{ padding:"20px 20px", textAlign:"center" }}>
              <div style={{ fontSize:24, marginBottom:6 }}>{s.icon}</div>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:32, fontWeight:900, color:C.purpleL }}>{s.value}</div>
              <div style={{ fontSize:12, color:C.textMuted, marginTop:2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Battle history */}
        <div className="fade-up" style={{ animationDelay:".15s" }}>
          <h3 style={{ fontWeight:800, fontSize:18, marginBottom:14 }}>Recent Battles</h3>
          <div className="card" style={{ overflow:"hidden" }}>
            {history.map((h,i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:16, padding:"14px 22px", borderBottom:i<history.length-1?`1px solid ${C.border}`:"none" }}>
                <div style={{ width:8, height:8, borderRadius:"50%", background:h.result==="WIN"?C.green:C.red, flexShrink:0 }}/>
                <span style={{ flex:1, fontWeight:600, fontSize:14 }}>{h.cat}</span>
                <span style={{ fontSize:12, color:C.textMuted }}>{h.date}</span>
                <span style={{ fontWeight:800, color:h.result==="WIN"?C.green:C.red, fontSize:13, width:40, textAlign:"center" }}>{h.result}</span>
                <span style={{ fontWeight:700, fontSize:14, color:C.text, width:60, textAlign:"right" }}>{h.score.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// LANDING PAGE
// ══════════════════════════════════════════════════════════════════════════════
function LandingPage({ onNavigate, user }) {
  const features = [
    { col:C.green,  icon:"⚡", title:"Dynamic Difficulty",  desc:"Our AI-driven engine adapts in real-time. The faster you answer correctly, the tougher the arena becomes — never a dull moment.", wide:true },
    { col:C.purple, icon:"♡", title:"3 Lives. No Regrets.", desc:"Mistakes have consequences. Protect your streak or face the cooldown.", badge:true },
    { col:C.gold,   icon:"🏆", title:"Ranked Play",         desc:"Climb from Bronze to Legend in monthly seasons." },
    { col:C.cyan,   icon:"👥", title:"Squad Battles",       desc:"Team up with friends for 4v4 cognitive combat." },
    { col:C.orange, icon:"🎯", title:"Precision Scoring",   desc:"Speed and accuracy both count. Every millisecond matters." },
  ];
  return (
    <div style={{ minHeight:"100vh", background:C.bg, overflowX:"hidden" }}>
      <Nav active="home" onNavigate={onNavigate} user={user} onLogout={() => {}} />

      {/* Hero */}
      <section style={{ position:"relative", overflow:"hidden", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"88vh", padding:"100px 24px 140px", textAlign:"center" }}>
        <div style={{ position:"absolute", inset:0, pointerEvents:"none" }}>
          <div style={{ position:"absolute", width:720, height:720, borderRadius:"50%", background:"radial-gradient(circle,rgba(124,58,237,.2) 0%,transparent 65%)", top:"-15%", left:"50%", transform:"translateX(-50%)" }}/>
          <div style={{ position:"absolute", width:380, height:380, borderRadius:"50%", background:"radial-gradient(circle,rgba(6,182,212,.11) 0%,transparent 65%)", bottom:"5%", right:"8%" }}/>
          <div style={{ position:"absolute", width:280, height:280, borderRadius:"50%", background:"radial-gradient(circle,rgba(16,185,129,.09) 0%,transparent 65%)", bottom:"18%", left:"5%" }}/>
        </div>

        <div className="fade-up" style={{ marginBottom:28 }}>
          <Badge><Dot/> Season 3 Live Now</Badge>
        </div>
        <h1 className="fade-up" style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"clamp(52px,9vw,98px)", fontWeight:900, lineHeight:.93, textTransform:"uppercase", letterSpacing:2, marginBottom:28, animationDelay:".1s" }}>
          Dominate the<br/><span style={{ color:C.purpleL }}>Knowledge Arena</span>
        </h1>
        <p className="fade-up" style={{ fontSize:17, color:C.textMuted, maxWidth:510, lineHeight:1.65, marginBottom:44, animationDelay:".2s" }}>
          The ultimate high-stakes trivia experience. Battle global opponents, climb the leaderboard, and prove your cognitive supremacy.
        </p>
        <div className="fade-up" style={{ display:"flex", gap:16, justifyContent:"center", animationDelay:".3s" }}>
          <button className="btn-primary" onClick={() => onNavigate(user ? "arena" : "signup")} style={{ fontSize:16, padding:"16px 38px", animation:"glow 2.8s infinite" }}>
            {user ? "Enter Arena" : "Start Your Battle"}
          </button>
          <button className="btn-outline" onClick={() => onNavigate("leaderboard")} style={{ fontSize:16, padding:"16px 38px" }}>View Leaderboard</button>
        </div>
      </section>

      {/* Features */}
      <section style={{ maxWidth:1120, margin:"0 auto", padding:"0 32px 80px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"3fr 2fr", gap:20, marginBottom:20 }}>
          {features.slice(0,2).map((f,i) => <FCard key={i} f={f}/>)}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }}>
          {features.slice(2).map((f,i) => <FCard key={i} f={f}/>)}
        </div>
      </section>

      {/* Stats */}
      <section style={{ maxWidth:1120, margin:"0 auto", padding:"0 32px 80px" }}>
        <div className="card" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)" }}>
          {[["500K+","Active Players"],["4.9M","Battles Fought"],["#1","Trivia Platform"]].map(([v,l],i) => (
            <div key={l} style={{ padding:"32px 0", textAlign:"center", borderRight:i<2?`1px solid ${C.border}`:"none" }}>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:44, fontWeight:900, color:C.purpleL }}>{v}</div>
              <div style={{ fontSize:13, color:C.textMuted, marginTop:4 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section style={{ maxWidth:1120, margin:"0 auto", padding:"0 32px 80px" }}>
          <div className="card" style={{ padding:"52px 40px", textAlign:"center" }}>
            <h2 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:38, fontWeight:900, textTransform:"uppercase", letterSpacing:2, marginBottom:12 }}>Ready to Climb the Leaderboard?</h2>
            <p style={{ color:C.textMuted, fontSize:15, marginBottom:36 }}>Join over 500,000 players in the world's most intense mental competition.</p>
            <div style={{ display:"flex", gap:16, justifyContent:"center" }}>
              <button className="btn-green" onClick={() => onNavigate("signup")} style={{ animation:"glowGreen 2.8s infinite" }}>Create Free Account</button>
              <button className="btn-outline" onClick={() => onNavigate("login")}>Log In</button>
            </div>
          </div>
        </section>
      )}
      <Footer/>
    </div>
  );
}

function FCard({ f }) {
  const [h,setH]=useState(false);
  return (
    <div onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{ background:h?C.bgCardAlt:C.bgCard, border:`1px solid ${h?f.col+"44":C.border}`, borderRadius:14, padding:"28px 26px", position:"relative", transition:"all .2s" }}>
      <div style={{ width:42,height:42,borderRadius:11,background:`${f.col}1e`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,marginBottom:16 }}>{f.icon}</div>
      <h3 style={{ fontSize:17,fontWeight:800,marginBottom:8 }}>{f.title}</h3>
      <p style={{ fontSize:13,color:C.textMuted,lineHeight:1.65 }}>{f.desc}</p>
      {f.badge && (
        <div style={{ display:"flex",gap:6,marginTop:20 }}>
          {[1,.55,.25].map((o,i)=><div key={i} style={{ height:4,flex:1,borderRadius:99,background:C.purple,opacity:o }}/>)}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ARENA PAGE
// ══════════════════════════════════════════════════════════════════════════════
const CATS = [
  { id:"geography", icon:"🌍", color:C.cyan,   title:"Geography",      desc:"Master the world's landscapes, borders, and cultures in high-stakes terrain challenges." },
  { id:"history",   icon:"📜", color:C.green,  title:"History",        desc:"Relive defining moments and test your knowledge of the legends that shaped civilization." },
  { id:"science",   icon:"🔬", color:C.purple, title:"Science & Tech", desc:"From quantum physics to code, tackle the frontier of human innovation and discovery." },
];

function ArenaPage({ onNavigate, user, onLogout }) {
  return (
    <Shell active="arena" onNavigate={onNavigate} user={user} onLogout={onLogout}>
      <div style={{ padding:"36px 40px", maxWidth:1060 }}>
        <div className="fade-up">
          <div style={{ fontSize:11, fontWeight:800, letterSpacing:2, textTransform:"uppercase", color:C.textMuted, marginBottom:6 }}>Choose Your Arena</div>
          <p style={{ color:C.textMuted, fontSize:14, marginBottom:32 }}>Select a category to begin your knowledge battle. Each victory climbs you higher in the global ranks.</p>
        </div>
        <div className="fade-up" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20, animationDelay:".08s" }}>
          {CATS.map(cat => <CatCard key={cat.id} cat={cat} onClick={() => onNavigate("battle")}/>)}
        </div>
      </div>
    </Shell>
  );
}

function CatCard({ cat, onClick }) {
  const [h,setH]=useState(false);
  return (
    <div onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{ background:h?C.bgCardAlt:C.bgCard, border:`1px solid ${h?cat.color+"55":C.border}`, borderRadius:14, padding:"36px 28px", cursor:"pointer", transition:"all .22s", transform:h?"translateY(-4px)":"none", boxShadow:h?"0 16px 40px rgba(0,0,0,.4)":"none" }}>
      <div style={{ width:52,height:52,borderRadius:14,background:`${cat.color}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,marginBottom:20 }}>{cat.icon}</div>
      <h3 style={{ fontSize:18,fontWeight:800,marginBottom:10 }}>{cat.title}</h3>
      <p style={{ fontSize:13,color:C.textMuted,lineHeight:1.65,marginBottom:24 }}>{cat.desc}</p>
      <div style={{ fontSize:13,fontWeight:700,color:h?cat.color:C.textMuted,transition:"color .2s" }}>Enter Arena →</div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// LEADERBOARD PAGE
// ══════════════════════════════════════════════════════════════════════════════
const LB_DATA = [
  { rank:1, name:"QuantumQuill", score:29400, streak:22, avatar:"🧑‍💻", badge:"Legend",   badgeC:"#f59e0b" },
  { rank:2, name:"NeuralNova",   score:28750, streak:18, avatar:"⚡",    badge:"Legend",   badgeC:"#f59e0b" },
  { rank:3, name:"CipherSage",   score:27300, streak:15, avatar:"🎯",    badge:"Diamond",  badgeC:C.cyan },
  { rank:4, name:"You",          score:24850, streak:12, avatar:"😎",    badge:"Gold III", badgeC:C.gold, you:true },
  { rank:5, name:"ByteBurner",   score:24120, streak:11, avatar:"🔥",    badge:"Gold II",  badgeC:C.gold },
  { rank:6, name:"MindStorm",    score:23600, streak:9,  avatar:"🌩",    badge:"Gold I",   badgeC:C.gold },
  { rank:7, name:"LogicLancer",  score:21900, streak:7,  avatar:"🏹",    badge:"Silver",   badgeC:C.textMuted },
  { rank:8, name:"DataDrifter",  score:20450, streak:5,  avatar:"🌊",    badge:"Silver",   badgeC:C.textMuted },
];

function LeaderboardPage({ onNavigate, user, onLogout }) {
  const [tab,setTab]=useState("global");
  const podium=[LB_DATA[1],LB_DATA[0],LB_DATA[2]];
  const medals=["🥈","🥇","🥉"];
  return (
    <Shell active="leaderboard" onNavigate={onNavigate} user={user} onLogout={onLogout}>
      <div style={{ padding:"36px 40px", maxWidth:860 }}>
        <div className="fade-up">
          <h2 style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:32,fontWeight:900,textTransform:"uppercase",letterSpacing:2,marginBottom:6 }}>Arena Rankings</h2>
          <p style={{ color:C.textMuted,fontSize:14,marginBottom:28 }}>Season 3 — Resets in 12 days</p>
        </div>
        <div className="fade-up" style={{ display:"flex",gap:4,marginBottom:28,background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:10,padding:4,width:"fit-content",animationDelay:".08s" }}>
          {["global","friends","weekly"].map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{ padding:"8px 20px",borderRadius:8,fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:1,background:tab===t?C.purple:"none",color:tab===t?"#fff":C.textMuted,transition:"all .2s" }}>{t}</button>
          ))}
        </div>
        {/* Podium */}
        <div className="fade-up" style={{ display:"grid",gridTemplateColumns:"1fr 1.12fr 1fr",gap:16,marginBottom:28,animationDelay:".14s" }}>
          {podium.map((p,i)=>(
            <div key={p.name} style={{ background:C.bgCard,border:`1px solid ${i===1?"#f59e0b55":C.border}`,borderRadius:14,padding:"24px 20px",textAlign:"center",marginTop:i===1?0:22,boxShadow:i===1?"0 0 32px rgba(245,158,11,.18)":"none" }}>
              <div style={{ fontSize:28,marginBottom:8 }}>{medals[i]}</div>
              <div style={{ width:52,height:52,borderRadius:"50%",background:`linear-gradient(135deg,${C.purple},${C.cyan})`,margin:"0 auto 10px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22 }}>{p.avatar}</div>
              <div style={{ fontWeight:800,fontSize:15,marginBottom:4 }}>{p.name}</div>
              <div style={{ fontSize:11,color:p.badgeC,fontWeight:700,marginBottom:8 }}>{p.badge}</div>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:28,fontWeight:900,color:i===1?C.gold:C.text }}>{p.score.toLocaleString()}</div>
            </div>
          ))}
        </div>
        {/* List */}
        <div className="card fade-up" style={{ overflow:"hidden",animationDelay:".22s" }}>
          {LB_DATA.map((p,i)=>(
            <div key={p.name} style={{ display:"flex",alignItems:"center",gap:14,padding:"14px 22px",borderBottom:i<LB_DATA.length-1?`1px solid ${C.border}`:"none",background:p.you?`${C.purple}12`:"none",transition:"background .15s" }}
              onMouseEnter={e=>{if(!p.you)e.currentTarget.style.background=C.bgCardAlt;}}
              onMouseLeave={e=>{if(!p.you)e.currentTarget.style.background="none";}}>
              <span style={{ width:24,textAlign:"center",fontSize:13,fontWeight:800,color:p.rank<=3?C.gold:C.textDim }}>{p.rank}</span>
              <div style={{ width:36,height:36,borderRadius:"50%",background:`linear-gradient(135deg,${C.purple},${C.cyan})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18 }}>{p.avatar}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700,fontSize:14 }}>{p.name}{p.you&&<span style={{ fontSize:11,color:C.green,marginLeft:6 }}>(You)</span>}</div>
                <div style={{ fontSize:11,color:p.badgeC }}>{p.badge}</div>
              </div>
              <div style={{ fontSize:11,color:C.green,marginRight:12 }}>🔥 {p.streak}</div>
              <div style={{ fontWeight:800,fontSize:15,color:p.rank===1?C.gold:C.text }}>{p.score.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TRAINING PAGE
// ══════════════════════════════════════════════════════════════════════════════
function ModeCard({ m, onNavigate }) {
  const [h, setH] = useState(false);
  return (
    <div onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} onClick={()=>onNavigate("battle")}
      style={{ background:C.bgCard,border:`1px solid ${h?m.color+"55":C.border}`,borderRadius:14,padding:"26px 24px",cursor:"pointer",transition:"all .2s",transform:h?"translateY(-3px)":"none" }}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16 }}>
        <div style={{ width:46,height:46,borderRadius:12,background:`${m.color}1e`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22 }}>{m.icon}</div>
        <Badge color={m.color} style={{ fontSize:10 }}>{m.tag}</Badge>
      </div>
      <h3 style={{ fontSize:17,fontWeight:800,marginBottom:8 }}>{m.title}</h3>
      <p style={{ fontSize:13,color:C.textMuted,lineHeight:1.6,marginBottom:18 }}>{m.desc}</p>
      <div style={{ fontSize:13,fontWeight:700,color:h?m.color:C.textMuted,transition:"color .2s" }}>Start Training →</div>
    </div>
  );
}

function TrainingPage({ onNavigate, user, onLogout }) {
  const modes=[
    { icon:"⚡",title:"Speed Round",    desc:"20 questions, 8 seconds each. Pure reflex.",          color:C.orange, tag:"FAST"  },
    { icon:"🧠",title:"Deep Think",     desc:"Fewer questions, no timer — perfect for learning.",    color:C.cyan,   tag:"CHILL" },
    { icon:"🎯",title:"Precision Mode", desc:"One wrong answer ends it. No lives.",                 color:C.pink,   tag:"HARD"  },
    { icon:"🔁",title:"Weakness Drill", desc:"AI targets categories you've struggled with.",        color:C.purple, tag:"SMART" },
  ];
  return (
    <Shell active="training" onNavigate={onNavigate} user={user} onLogout={onLogout}>
      <div style={{ padding:"36px 40px",maxWidth:920 }}>
        <div className="fade-up">
          <h2 style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:32,fontWeight:900,textTransform:"uppercase",letterSpacing:2,marginBottom:6 }}>Training Centre</h2>
          <p style={{ color:C.textMuted,fontSize:14,marginBottom:32 }}>Sharpen your skills before the next ranked battle.</p>
        </div>
        <div className="fade-up" style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:28,animationDelay:".1s" }}>
          {modes.map((m,idx)=> <ModeCard key={idx} m={m} onNavigate={onNavigate}/> )}
        </div>
        <div className="card fade-up" style={{ padding:"28px 28px",animationDelay:".2s" }}>
          <h3 style={{ fontWeight:800,marginBottom:20 }}>Your Progress This Week</h3>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:20 }}>
            {[["🎮","Sessions","14"],["✅","Accuracy","78%"],["⏱","Avg Speed","3.1s"],["📈","XP Earned","2,400"]].map(([ic,lb,val])=>(
              <div key={lb} style={{ textAlign:"center" }}>
                <div style={{ fontSize:24,marginBottom:4 }}>{ic}</div>
                <div style={{ fontSize:11,color:C.textMuted,marginBottom:4 }}>{lb}</div>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:28,fontWeight:900,color:C.purpleL }}>{val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// BATTLE PAGE — auto-advance after answer
// ══════════════════════════════════════════════════════════════════════════════
const QS = [
  { cat:"Quantum Physics",  q:"Which phenomenon describes the ability of a subatomic particle to exist in multiple states simultaneously until it is observed?",   opts:["Quantum Entanglement","Superposition","The Uncertainty Principle","Wave-Particle Duality"], ans:1 },
  { cat:"Science & Tech",   q:"What is the process by which plants convert sunlight into chemical energy?",                                                         opts:["Respiration","Fermentation","Photosynthesis","Transpiration"],                          ans:2 },
  { cat:"History",          q:"In which year did the Berlin Wall fall, reuniting East and West Germany?",                                                           opts:["1987","1989","1991","1993"],                                                           ans:1 },
  { cat:"Geography",        q:"Which country has the most natural lakes in the world?",                                                                              opts:["Russia","Brazil","USA","Canada"],                                                      ans:3 },
  { cat:"Science & Tech",   q:"What gas do plants primarily absorb from the atmosphere during photosynthesis?",                                                     opts:["Oxygen","Nitrogen","Carbon Dioxide","Hydrogen"],                                       ans:2 },
  { cat:"History",          q:"Who was the first person to walk on the moon?",                                                                                      opts:["Buzz Aldrin","Yuri Gagarin","Neil Armstrong","John Glenn"],                            ans:2 },
  { cat:"Geography",        q:"What is the capital city of Australia?",                                                                                             opts:["Sydney","Melbourne","Brisbane","Canberra"],                                           ans:3 },
  { cat:"Science & Tech",   q:"What does 'CPU' stand for?",                                                                                                        opts:["Central Processing Unit","Computer Power Unit","Core Processing Unit","Central Power Utility"], ans:0 },
];

const AUTO_ADVANCE_DELAY = 1200; // ms after picking before moving to next question

function BattlePage({ onNavigate, user, onLogout }) {
  const [qi,  setQi]   = useState(0);
  const [sel, setSel]  = useState(null);
  const [done,setDone] = useState(false);
  const [lives,setLives]=useState(3);
  const [streak,setStreak]=useState(0);
  const [pts,setPts]=useState(0);
  const [timer,setTimer]=useState(14);
  const [shk,setShk]=useState(false);
  const [feedback, setFeedback] = useState(null); // "correct" | "wrong"
  const TOTAL=14;
  const q=QS[qi];

  useEffect(()=>{ setSel(null); setDone(false); setTimer(TOTAL); setFeedback(null); },[qi]);

  // countdown timer
  useEffect(()=>{
    if(done) return;
    if(timer<=0){ pick(-1); return; }
    const t=setTimeout(()=>setTimer(v=>v-1),1000);
    return()=>clearTimeout(t);
  },[timer,done]);

  // auto-advance after answering
  useEffect(()=>{
    if(!done) return;
    const t=setTimeout(()=>{
      if(qi>=QS.length-1){ onNavigate("results"); }
      else{ setQi(v=>v+1); }
    }, AUTO_ADVANCE_DELAY);
    return()=>clearTimeout(t);
  },[done,qi]);

  const pick=(i)=>{
    if(done) return;
    setSel(i); setDone(true);
    if(i===q.ans){
      setStreak(v=>v+1); setPts(v=>v+350+(timer*20));
      setFeedback("correct");
    } else {
      setLives(v=>Math.max(0,v-1)); setStreak(0);
      setFeedback("wrong");
      setShk(true); setTimeout(()=>setShk(false),600);
    }
  };

  const frac=timer/TOTAL;
  const tc=timer<=4?C.red:timer<=8?C.orange:C.purpleL;
  const prog=((qi+1)/QS.length)*100;
  const circ=170;

  return (
    <Shell active="arena" onNavigate={onNavigate} user={user} onLogout={onLogout}>
      <div style={{ padding:"24px 40px", maxWidth:800 }}>

        {/* HUD */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20, gap:12 }}>
          <div className="card" style={{ padding:"10px 20px", minWidth:165 }}>
            <div style={{ fontSize:10,color:C.textMuted,fontWeight:700,letterSpacing:1 }}>LIVES LEFT</div>
            <div style={{ fontSize:20,fontWeight:900,display:"flex",alignItems:"center",gap:5,marginTop:2 }}>
              {lives}/3&nbsp;
              {[...Array(3)].map((_,i)=><span key={i} style={{ fontSize:16,filter:i>=lives?"grayscale(1) opacity(.3)":"none",transition:"filter .3s",animation:i<lives?"heartbeat 2s infinite":"none" }}>❤️</span>)}
            </div>
          </div>

          <div style={{ textAlign:"center" }}>
            <div style={{ color:C.green,fontWeight:800,fontSize:12,letterSpacing:1 }}>🔥 {streak} STREAK</div>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:38,fontWeight:900,lineHeight:1 }}>{pts.toLocaleString()}</div>
            <div style={{ fontSize:10,color:C.textMuted,letterSpacing:1 }}>POINTS</div>
          </div>

          {/* Timer ring */}
          <div style={{ position:"relative",width:66,height:66 }}>
            <svg width={66} height={66} style={{ transform:"rotate(-90deg)" }}>
              <circle cx={33} cy={33} r={27} fill="none" stroke={C.border} strokeWidth={5}/>
              <circle cx={33} cy={33} r={27} fill="none" stroke={tc} strokeWidth={5}
                strokeDasharray={circ} strokeDashoffset={circ*(1-frac)} strokeLinecap="round"
                style={{ transition:"stroke-dashoffset .9s linear,stroke .3s" }}/>
            </svg>
            <div style={{ position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center" }}>
              <span style={{ fontSize:18,fontWeight:900,color:tc }}>{timer}</span>
              <span style={{ fontSize:8,color:C.textMuted }}>SEC</span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ display:"flex",justifyContent:"space-between",fontSize:11,fontWeight:700,color:C.textMuted,marginBottom:6,letterSpacing:1 }}>
          <span>QUESTION {qi+1} OF {QS.length}</span>
          <span>{Math.round(prog)}% COMPLETE</span>
        </div>
        <div style={{ height:6,background:C.border,borderRadius:99,marginBottom:22,overflow:"hidden" }}>
          <div style={{ height:"100%",width:`${prog}%`,background:`linear-gradient(90deg,${C.purple},${C.green})`,borderRadius:99,transition:"width .4s" }}/>
        </div>

        {/* Feedback banner — shows briefly after answering */}
        {feedback && (
          <div className="fade-in" style={{
            marginBottom:14, borderRadius:10, padding:"12px 20px",
            background: feedback==="correct" ? `${C.green}18` : `${C.red}18`,
            border:`1px solid ${feedback==="correct"?C.green+"44":C.red+"44"}`,
            color: feedback==="correct" ? C.green : C.red,
            fontWeight:700, fontSize:14, display:"flex", alignItems:"center", gap:10,
          }}>
            {feedback==="correct" ? "✅ Correct! +" + (350+(timer*20)) + " pts" : "❌ Wrong! Moving on…"}
            <span style={{ marginLeft:"auto", fontSize:12, opacity:.7 }}>Next question in {AUTO_ADVANCE_DELAY/1000}s…</span>
          </div>
        )}

        {/* Question card */}
        <div className="card slide-in" key={qi} style={{ padding:"32px 36px", marginBottom:14, animation:shk?"shake .5s ease":"none" }}>
          <Badge color={C.cyan} style={{ marginBottom:20 }}>{q.cat}</Badge>
          <h2 style={{ fontSize:20,fontWeight:800,lineHeight:1.55,marginBottom:28 }}>{q.q}</h2>

          <div style={{ display:"flex",flexDirection:"column",gap:11 }}>
            {q.opts.map((opt,i)=>{
              let bg=C.bgCardAlt, brd=C.border, col=C.text, fw=600;
              if(done){
                if(i===q.ans)    { bg=`${C.green}18`; brd=C.green; col=C.green; fw=800; }
                else if(i===sel) { bg=`${C.red}18`;   brd=C.red;   col=C.red; }
              }
              return (
                <button key={i} onClick={()=>pick(i)} style={{
                  display:"flex",alignItems:"center",gap:14,
                  background:bg,border:`1.5px solid ${brd}`,borderRadius:11,
                  padding:"14px 18px",color:col,fontSize:14,fontWeight:fw,textAlign:"left",
                  transition:"all .15s", cursor:done?"default":"pointer",
                  animation:done&&i===q.ans?"correctPop .3s ease":"none",
                }}
                onMouseEnter={e=>{ if(!done){ e.currentTarget.style.background=`${C.purple}18`; e.currentTarget.style.borderColor=C.purple; }}}
                onMouseLeave={e=>{ if(!done){ e.currentTarget.style.background=bg; e.currentTarget.style.borderColor=brd; }}}>
                  <span style={{ width:28,height:28,borderRadius:7,background:`${C.border}cc`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:C.textMuted,flexShrink:0 }}>
                    {String.fromCharCode(65+i)}
                  </span>
                  {opt}
                  {done&&i===q.ans&&<span style={{ marginLeft:"auto" }}>✅</span>}
                  {done&&i===sel&&i!==q.ans&&<span style={{ marginLeft:"auto" }}>❌</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Power-ups */}
        <div style={{ display:"flex",gap:10,justifyContent:"center" }}>
          {[["👁","50/50"],["⏱","+10 SEC"],["👥","POLL"]].map(([ic,lb])=>(
            <button key={lb} style={{ background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:10,padding:"10px 20px",color:C.textMuted,display:"flex",flexDirection:"column",alignItems:"center",gap:3,fontSize:18,transition:"all .15s" }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=C.purple;e.currentTarget.style.color=C.purpleL;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.textMuted;}}>
              {ic}<span style={{ fontSize:10,fontWeight:700,letterSpacing:1 }}>{lb}</span>
            </button>
          ))}
        </div>
      </div>
    </Shell>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// RESULTS PAGE
// ══════════════════════════════════════════════════════════════════════════════
function ResultsPage({ onNavigate, user, onLogout }) {
  const lb=[
    { rank:1,name:"QuantumQuill",score:29400,avatar:"🧑‍💻" },
    { rank:4,name: user?.username||"You", score:24850,avatar:"😎",you:true },
    { rank:5,name:"ByteBurner",  score:24120,avatar:"🔥" },
  ];
  return (
    <div style={{ minHeight:"100vh",background:C.bg }}>
      <Nav active="arena" onNavigate={onNavigate} user={user} onLogout={onLogout}/>
      <div style={{ maxWidth:780,margin:"0 auto",padding:"60px 24px 80px" }}>
        <div className="fade-up" style={{ textAlign:"center",marginBottom:44 }}>
          <Badge color={C.green} style={{ marginBottom:22 }}>Battle Concluded</Badge>
          <h1 style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:"clamp(40px,7vw,66px)",fontWeight:900,marginBottom:10 }}>Knowledge Warrior</h1>
          <p style={{ color:C.textMuted,fontSize:15 }}>You've dominated the arena with lightning-fast precision.</p>
        </div>
        <div className="fade-up" style={{ display:"grid",gridTemplateColumns:"1fr auto",gap:16,marginBottom:16,animationDelay:".1s" }}>
          <div className="card" style={{ padding:"28px 28px" }}>
            <div style={{ fontSize:10,letterSpacing:1.5,fontWeight:700,color:C.textMuted,marginBottom:8 }}>FINAL ARENA SCORE</div>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:44,fontWeight:900,color:C.green,marginBottom:18 }}>+150 XP</div>
            <div style={{ display:"flex",justifyContent:"space-between",marginBottom:6,fontSize:12 }}>
              <span style={{ color:C.textMuted }}>Battle Progress</span>
              <span style={{ color:C.purpleL,fontWeight:700 }}>LVL {user?.level||1}</span>
            </div>
            <div style={{ height:6,background:C.border,borderRadius:99,overflow:"hidden" }}>
              <div style={{ height:"100%",width:"72%",background:`linear-gradient(90deg,${C.green},${C.cyan})`,borderRadius:99 }}/>
            </div>
          </div>
          <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
            {[["🏆","PERSONAL BEST","26,100",C.text],["🎯","PRECISION","94%",C.green]].map(([ic,lb2,val,col])=>(
              <div key={lb2} className="card" style={{ padding:"18px 22px",textAlign:"center",minWidth:150 }}>
                <div style={{ fontSize:18,marginBottom:4 }}>{ic}</div>
                <div style={{ fontSize:10,letterSpacing:1,fontWeight:700,color:C.textMuted }}>{lb2}</div>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:28,fontWeight:900,marginTop:4,color:col }}>{val}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="fade-up" style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:30,animationDelay:".15s" }}>
          {[["⚡","SPEED BONUS","2.4s Avg"],["🔥","STREAK","12 Correct"],["🎖","RANK UP","Gold III"],["💀","LIVES LOST","0/3"]].map(([ic,lb2,val])=>(
            <div key={lb2} className="card" style={{ padding:"16px 16px" }}>
              <div style={{ fontSize:20,marginBottom:4 }}>{ic}</div>
              <div style={{ fontSize:9,color:C.textMuted,fontWeight:700,letterSpacing:1 }}>{lb2}</div>
              <div style={{ fontWeight:800,fontSize:16,marginTop:2 }}>{val}</div>
            </div>
          ))}
        </div>
        <div className="fade-up" style={{ display:"flex",gap:14,justifyContent:"center",marginBottom:50,animationDelay:".2s" }}>
          <button className="btn-primary" onClick={()=>onNavigate("battle")} style={{ fontSize:16,padding:"16px 40px",animation:"glow 2.8s infinite" }}>🔄 Play Again</button>
          <button className="btn-outline" onClick={()=>onNavigate("arena")} style={{ fontSize:16,padding:"16px 40px" }}>← Back to Arena</button>
        </div>
        <div className="fade-up" style={{ animationDelay:".25s" }}>
          <h3 style={{ fontWeight:800,fontSize:18,marginBottom:14 }}>Arena Rankings</h3>
          <div className="card" style={{ overflow:"hidden" }}>
            {lb.map((p,i)=>(
              <div key={p.name} style={{ display:"flex",alignItems:"center",gap:14,padding:"16px 22px",borderBottom:i<lb.length-1?`1px solid ${C.border}`:"none",background:p.you?`${C.purple}12`:"none" }}>
                <span style={{ width:22,fontWeight:800,fontSize:13,color:p.rank===1?C.gold:C.textDim }}>{p.rank}</span>
                <div style={{ width:36,height:36,borderRadius:"50%",background:`linear-gradient(135deg,${C.purple},${C.cyan})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18 }}>{p.avatar}</div>
                <span style={{ flex:1,fontWeight:p.you?700:500 }}>{p.name}</span>
                {p.you&&<span style={{ fontSize:11,color:C.green,fontWeight:700 }}>Recently Achieved</span>}
                <span style={{ fontWeight:800,color:p.rank===1?C.gold:C.text }}>{p.score.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ROOT
// ══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);

  const nav = useCallback((dest) => {
    const map = {
      home:"home", arena:"arena", leaderboard:"leaderboard", training:"training",
      battle:"battle", results:"results",
      login:"login", signup:"signup", profile:"profile",
      quests:"arena", achievements:"achievements", settings:"profile",
    };
    setPage(map[dest] ?? dest);
    window.scrollTo(0,0);
  }, []);

  const login  = useCallback((u) => setUser(u), []);
  const logout = useCallback(() => { setUser(null); setPage("home"); }, []);
  const updateUser = useCallback((u) => setUser(u), []);

  const shared = { onNavigate:nav, user, onLogout:logout };

  return (
    <>
      <style>{G}</style>
      <div className="page-in" key={page}>
        {page==="home"        && <LandingPage    {...shared}/>}
        {page==="login"       && <LoginPage       onNavigate={nav} onLogin={login}/>}
        {page==="signup"      && <SignupPage      onNavigate={nav} onLogin={login}/>}
        {page==="profile"     && <ProfilePage     {...shared} onUpdateUser={updateUser}/>}
        {page==="arena"       && <ArenaPage       {...shared}/>}
        {page==="leaderboard" && <LeaderboardPage {...shared}/>}
        {page==="training"    && <TrainingPage    {...shared}/>}
        {page==="battle"      && <BattlePage      {...shared}/>}
        {page==="results"     && <ResultsPage     {...shared}/>}
        {page==="achievements"&& <ArenaPage       {...shared}/>}
      </div>
    </>
  );
}
