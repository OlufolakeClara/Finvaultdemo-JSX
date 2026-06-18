import { useState, useMemo, useCallback, useEffect, Fragment, createContext, useContext } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";
import {
  LayoutDashboard, ArrowLeftRight, CreditCard, Target, ListOrdered,
  Bell, Settings, LogOut, ArrowUpRight, ArrowDownLeft, Plus, Check,
  Eye, EyeOff, Wallet, Building2, AlertTriangle, ShieldCheck, TrendingUp,
  Menu, X, Sun, Moon, BarChart3, ShieldAlert, Smartphone, Laptop,
  Monitor, Lock, Key, BellOff, CheckCheck, Info, User, Sliders,
  ChevronRight, Trash2, Download, AlertCircle, Shield, Activity, Camera,
  Globe, Phone, Zap, Star, TrendingDown
} from "lucide-react";

// ─── THEMES ─────────────────────────────────────────────────
const mkGlass = (bg, border, shadow="none") => (extra={}) => ({
  background:bg, border:`1px solid ${border}`, borderRadius:16,
  backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)",
  boxShadow:shadow, ...extra,
});
const DARK = {
  bg:"#0F1B2D", surface:"rgba(26,43,69,0.65)", surfaceSolid:"#1A2B45",
  surfaceL:"#213353", border:"rgba(255,255,255,0.08)", borderM:"rgba(255,255,255,0.13)",
  text:{p:"#f8fafc",s:"#94a3b8",m:"#64748b"},
  sidebarBg:"rgba(26,43,69,0.6)", headerBg:"rgba(15,27,45,0.93)",
  bnavBg:"rgba(26,43,69,0.96)", inputBg:"#213353",
  confirmBg:"rgba(15,27,45,0.55)", avatarBg:"#213353",
  glass:mkGlass("rgba(26,43,69,0.65)","rgba(255,255,255,0.08)"),
};
const LIGHT = {
  bg:"#F0F4F8", surface:"rgba(255,255,255,0.9)", surfaceSolid:"#FFFFFF",
  surfaceL:"#EEF2F7", border:"rgba(15,27,45,0.09)", borderM:"rgba(15,27,45,0.15)",
  text:{p:"#0F1B2D",s:"#374151",m:"#6B7280"},
  sidebarBg:"rgba(255,255,255,0.97)", headerBg:"rgba(248,250,252,0.97)",
  bnavBg:"rgba(255,255,255,0.98)", inputBg:"#EEF2F7",
  confirmBg:"rgba(15,27,45,0.05)", avatarBg:"#E2E8F0",
  glass:mkGlass("rgba(255,255,255,0.88)","rgba(15,27,45,0.09)","0 2px 12px rgba(15,27,45,0.07)"),
};
const ThemeCtx = createContext(DARK);
const useT = () => useContext(ThemeCtx);

// ─── BRAND ──────────────────────────────────────────────────
const C = { mint:"#00C896", mintDim:"#00A87E", blue:"#2D9CDB", red:"#FF4D4F", purple:"#8B5CF6", amber:"#F59E0B", navy:"#0F1B2D" };

// ─── CSS ────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
* { box-sizing: border-box; }
::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 999px; }
.light ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); }
input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
select option { background: #213353; color: #f8fafc; }
.light select option { background: #EEF2F7; color: #0F1B2D; }
@keyframes toastIn     { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
@keyframes slideInLeft { from{transform:translateX(-100%);opacity:.5} to{transform:translateX(0);opacity:1} }
@keyframes fadeIn      { from{opacity:0} to{opacity:1} }
@keyframes pulse       { 0%,100%{opacity:1} 50%{opacity:.5} }
.fv-app      { display:flex; height:100vh; overflow:hidden; font-family:'Inter',system-ui,sans-serif; }
.fv-desk-sb  { width:240px; flex-shrink:0; height:100vh; position:sticky; top:0; }
.fv-main-col { flex:1; display:flex; flex-direction:column; overflow:hidden; min-width:0; }
.fv-scroll   { flex:1; overflow-y:auto; padding:28px 36px; }
.fv-mob-hdr  { display:none; position:sticky; top:0; z-index:90;
               align-items:center; justify-content:space-between; padding:12px 16px;
               backdrop-filter:blur(18px); -webkit-backdrop-filter:blur(18px);
               border-bottom-width:1px; border-bottom-style:solid; flex-shrink:0; }
.fv-bnav     { display:none; position:fixed; bottom:0; left:0; right:0; z-index:90;
               backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px);
               border-top-width:1px; border-top-style:solid; }
@media(max-width:1023px){
  .fv-desk-sb { display:none!important; }
  .fv-mob-hdr { display:flex!important; }
  .fv-bnav    { display:flex!important; }
  .fv-scroll  { padding:16px 16px 82px 16px; }
}
@media(max-width:639px){ .fv-scroll { padding:12px 12px 82px 12px; } }
.g-stats  { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; }
.g-accts  { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; }
.g-charts { display:grid; grid-template-columns:1.6fr 1fr; gap:14px; }
.g-goals  { display:grid; grid-template-columns:repeat(auto-fill,minmax(260px,1fr)); gap:16px; }
.g-halves { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
@media(min-width:768px) and (max-width:1023px){
  .g-accts  { grid-template-columns:repeat(2,1fr); }
  .g-charts { grid-template-columns:1fr; }
  .g-halves { grid-template-columns:1fr; }
}
@media(max-width:767px){
  .g-stats  { grid-template-columns:repeat(2,1fr); gap:10px; }
  .g-accts  { grid-template-columns:repeat(2,1fr); gap:10px; }
  .g-charts { grid-template-columns:1fr; }
  .g-goals  { grid-template-columns:1fr; }
  .g-halves { grid-template-columns:1fr; }
}
.fv-scroll   { overflow-x:hidden; }
.fv-main-col { overflow-x:hidden; }

/* ── Desktop top header ───────────────────── */
.fv-desk-hdr { display:none; }
@media(min-width:1024px){
  .fv-desk-hdr {
    display:flex; align-items:center; gap:16px;
    padding:0 32px; height:64px; flex-shrink:0;
    position:sticky; top:0; z-index:80;
    border-bottom-width:1px; border-bottom-style:solid;
    backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px);
  }
  .fv-scroll { padding-top:28px; }
}

/* ── Overview hero split (desktop) ─────────── */
.ov-top { display:flex; flex-direction:column; gap:16px; }
@media(min-width:1024px){
  .ov-top { flex-direction:row; align-items:flex-start; gap:20px; }
  .ov-left  { flex:1.05; min-width:0; }
  .ov-right { width:340px; flex-shrink:0; }
}

/* ── ATM cards: 2-col grid desktop, snap-scroll mobile ── */
.cards-grid { display:flex; gap:14px; overflow-x:auto; scroll-snap-type:x mandatory;
              -webkit-overflow-scrolling:touch; padding-bottom:6px; scrollbar-width:none; }
.cards-grid::-webkit-scrollbar { display:none; }
.cards-grid > * { flex-shrink:0; width:min(300px,82vw); scroll-snap-align:start; }
@media(min-width:1024px){
  .cards-grid { display:grid; grid-template-columns:repeat(2,1fr); overflow-x:visible;
                gap:14px; padding-bottom:0; }
  .cards-grid > * { width:auto; }
}

/* ── Mobile card strip (tablet) ──────────── */
.card-scroll { display:flex; gap:18px; overflow-x:auto; scroll-snap-type:x mandatory;
               -webkit-overflow-scrolling:touch; padding-bottom:6px; scrollbar-width:none; }
.card-scroll::-webkit-scrollbar { display:none; }
.card-scroll > * { flex-shrink:0; width:min(308px,84vw); scroll-snap-align:start; }
@media(min-width:768px) and (max-width:1023px){
  .card-scroll { display:grid; grid-template-columns:repeat(2,1fr); overflow-x:visible; gap:14px; }
  .card-scroll > * { width:auto; }
}
@media(min-width:1024px){
  .mob-greeting { display:none!important; }
  .ov-right > div { min-height:100%; }
}
.atm-card { transition:transform 0.38s cubic-bezier(.34,1.56,.64,1),box-shadow 0.38s ease; cursor:pointer; will-change:transform; }
.atm-card:hover { transform:translateY(-12px) rotate(-0.4deg); }
@keyframes cardRise { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
.rise   { animation:cardRise 0.55s ease both; }
.rise-1 { animation-delay:0.05s; }
.rise-2 { animation-delay:0.13s; }
.rise-3 { animation-delay:0.22s; }
@keyframes heroPulse { 0%,100%{opacity:0.5} 50%{opacity:1} }
.hero-glow { animation:heroPulse 5s ease-in-out infinite; }
@keyframes heroShift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
.tx-desc { display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; white-space:normal; word-break:break-word; }
@keyframes barGrow { from{width:0%} to{width:var(--target-w,50%)} }
`;

// ─── LOGO MARK (unique SVG) ──────────────────────────────────
function LogoMark({ size=34 }) {
  const id = `fvg${size}`;
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <defs>
        <linearGradient id={`${id}a`} x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00E5A8"/><stop offset="1" stopColor="#007A5A"/>
        </linearGradient>
        <linearGradient id={`${id}b`} x1="20" y1="1" x2="20" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" stopOpacity="0.30"/><stop offset="1" stopColor="white" stopOpacity="0"/>
        </linearGradient>
      </defs>
      {/* Badge shape */}
      <rect width="40" height="40" rx="11" fill={`url(#${id}a)`}/>
      <rect width="40" height="22" rx="11" fill={`url(#${id}b)`}/>
      {/* Vault ring */}
      <circle cx="20" cy="22" r="9" stroke="#062213" strokeWidth="1.9" strokeOpacity=".65" fill="none"/>
      {/* Dial ticks (N S E W) */}
      <line x1="20" y1="12.2" x2="20" y2="14.5" stroke="#062213" strokeWidth="1.8" strokeLinecap="round" strokeOpacity=".6"/>
      <line x1="29.8" y1="22" x2="27.5" y2="22" stroke="#062213" strokeWidth="1.8" strokeLinecap="round" strokeOpacity=".6"/>
      <line x1="10.2" y1="22" x2="12.5" y2="22" stroke="#062213" strokeWidth="1.8" strokeLinecap="round" strokeOpacity=".6"/>
      <line x1="20" y1="31.8" x2="20" y2="29.5" stroke="#062213" strokeWidth="1.8" strokeLinecap="round" strokeOpacity=".6"/>
      {/* Center hub */}
      <circle cx="20" cy="22" r="3.2" fill="#062213" fillOpacity=".65"/>
      {/* Growth trend line cutting through */}
      <path d="M8 30L13 22.5L17.5 26L23 16.5L32 12" stroke="#062213" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" strokeOpacity=".78"/>
    </svg>
  );
}

// ─── MOCK DATA ───────────────────────────────────────────────
const DEMO = { email:"alex@finvault.io", password:"Demo1234!" };
const INIT_ACCOUNTS = [
  { id:"a1", type:"CHECKING", nickname:"Primary Checking",    number:"4821739065", balance:24389.50, color:C.blue   },
  { id:"a2", type:"SAVINGS",  nickname:"High-Yield Savings",  number:"9034521876", balance:18750.00, color:C.mint   },
  { id:"a3", type:"CREDIT",   nickname:"Rewards Credit Card", number:"6612004893", balance:-2340.88, color:C.purple },
];
const TRANSACTIONS = [
  { id:"t1",  accountId:"a1", type:"DEPOSIT",    amount:5800,   description:"Direct Deposit — Anthropic Inc",  category:"SALARY",        date:"2026-06-09" },
  { id:"t2",  accountId:"a1", type:"WITHDRAWAL", amount:2450,   description:"Zelle — Sunset Properties LLC",   category:"RENT",          date:"2026-06-08" },
  { id:"t3",  accountId:"a1", type:"WITHDRAWAL", amount:134.27, description:"Whole Foods Market",              category:"FOOD",          date:"2026-06-07" },
  { id:"t4",  accountId:"a1", type:"WITHDRAWAL", amount:89.40,  description:"PG&E — Electric & Gas",           category:"UTILITIES",     date:"2026-06-06" },
  { id:"t5",  accountId:"a1", type:"WITHDRAWAL", amount:14.50,  description:"Uber — Trip to SFO",              category:"TRANSPORT",     date:"2026-06-05" },
  { id:"t6",  accountId:"a1", type:"WITHDRAWAL", amount:48.90,  description:"Chipotle Mexican Grill",          category:"FOOD",          date:"2026-06-04" },
  { id:"t7",  accountId:"a1", type:"WITHDRAWAL", amount:15.99,  description:"Netflix",                         category:"SUBSCRIPTION",  date:"2026-06-03" },
  { id:"t8",  accountId:"a1", type:"WITHDRAWAL", amount:9.99,   description:"Spotify Premium",                 category:"SUBSCRIPTION",  date:"2026-06-03" },
  { id:"t9",  accountId:"a1", type:"TRANSFER",   amount:1500,   description:"Transfer → High-Yield Savings",  category:"TRANSFER",      date:"2026-06-02" },
  { id:"t10", accountId:"a2", type:"DEPOSIT",    amount:1500,   description:"Transfer ← Primary Checking",    category:"TRANSFER",      date:"2026-06-02" },
  { id:"t11", accountId:"a1", type:"WITHDRAWAL", amount:22.40,  description:"Blue Bottle Coffee",              category:"FOOD",          date:"2026-06-01" },
  { id:"t12", accountId:"a1", type:"WITHDRAWAL", amount:68.00,  description:"Shell Gas Station",               category:"TRANSPORT",     date:"2026-05-30" },
  { id:"t13", accountId:"a1", type:"WITHDRAWAL", amount:79.99,  description:"Comcast Xfinity — Internet",      category:"UTILITIES",     date:"2026-05-29" },
  { id:"t14", accountId:"a1", type:"WITHDRAWAL", amount:162.55, description:"Trader Joe's",                    category:"FOOD",          date:"2026-05-28" },
  { id:"t15", accountId:"a1", type:"WITHDRAWAL", amount:14.99,  description:"ChatGPT Plus",                    category:"SUBSCRIPTION",  date:"2026-05-27" },
  { id:"t16", accountId:"a1", type:"WITHDRAWAL", amount:142.00, description:"Ticketmaster — SF Symphony",      category:"ENTERTAINMENT", date:"2026-05-25" },
  { id:"t17", accountId:"a1", type:"WITHDRAWAL", amount:239.00, description:"Apple Store — AirPods",           category:"SHOPPING",      date:"2026-05-24" },
  { id:"t18", accountId:"a1", type:"WITHDRAWAL", amount:74.30,  description:"DoorDash — Nobu Restaurant",      category:"FOOD",          date:"2026-05-22" },
  { id:"t19", accountId:"a2", type:"DEPOSIT",    amount:38.54,  description:"Interest Payment — 4.85% APY",   category:"SALARY",        date:"2026-06-01" },
  { id:"t20", accountId:"a1", type:"DEPOSIT",    amount:5800,   description:"Direct Deposit — Anthropic Inc",  category:"SALARY",        date:"2026-05-24" },
  { id:"t21", accountId:"a1", type:"WITHDRAWAL", amount:40.00,  description:"UCSF Medical — Co-pay",           category:"HEALTHCARE",    date:"2026-05-21" },
  { id:"t22", accountId:"a1", type:"WITHDRAWAL", amount:88.47,  description:"Amazon.com",                      category:"SHOPPING",      date:"2026-05-20" },
  { id:"t23", accountId:"a1", type:"WITHDRAWAL", amount:38.15,  description:"Sweetgreen",                      category:"FOOD",          date:"2026-05-19" },
  { id:"t24", accountId:"a1", type:"WITHDRAWAL", amount:36.50,  description:"AMC Theatres",                    category:"ENTERTAINMENT", date:"2026-05-18" },
];
const INIT_GOALS = [
  { id:"g1", name:"Japan Vacation",  emoji:"✈️", target:6000,  current:4200,  deadline:"2026-10-08" },
  { id:"g2", name:"Emergency Fund",  emoji:"🛡️", target:20000, current:18750, deadline:null         },
  { id:"g3", name:"New MacBook Pro", emoji:"💻", target:3500,  current:875,   deadline:"2026-09-08" },
];
const MONTHLY = [
  { month:"Jan", inflow:5838,  outflow:3820 }, { month:"Feb", inflow:5838,  outflow:4150 },
  { month:"Mar", inflow:5838,  outflow:3640 }, { month:"Apr", inflow:11676, outflow:4890 },
  { month:"May", inflow:5876,  outflow:4380 }, { month:"Jun", inflow:5838,  outflow:2866 },
];
const CATEGORY_SPEND = [
  { name:"Rent",value:2450,color:C.blue }, { name:"Food",value:654,color:C.mint },
  { name:"Shopping",value:327,color:C.red }, { name:"Entertainment",value:178,color:"#EC4899" },
  { name:"Utilities",value:169,color:"#6366F1" }, { name:"Transport",value:104,color:C.amber },
  { name:"Healthcare",value:68,color:"#10B981" }, { name:"Subscriptions",value:66,color:C.purple },
];
const CAT_FILTERS = ["All","FOOD","RENT","SALARY","UTILITIES","TRANSPORT","SUBSCRIPTION","ENTERTAINMENT","SHOPPING","HEALTHCARE","TRANSFER"];

// Notifications mock data
const INIT_NOTIFS = [
  { id:"n1", type:"transaction", icon:ArrowDownLeft, color:C.mint,   title:"Salary received",          body:"$5,800.00 deposited to Primary Checking",          time:"2 hours ago",  read:false },
  { id:"n2", type:"security",    icon:ShieldAlert,   color:C.red,    title:"New sign-in detected",     body:"Chrome on MacBook Pro — San Francisco, CA",          time:"3 hours ago",  read:false },
  { id:"n3", type:"goal",        icon:Star,          color:C.amber,  title:"Goal milestone reached!",  body:"Japan Vacation is 70% funded — keep it up!",         time:"1 day ago",    read:false },
  { id:"n4", type:"transaction", icon:ArrowUpRight,  color:C.red,    title:"Large withdrawal",         body:"$2,450.00 — Zelle to Sunset Properties LLC",         time:"1 day ago",    read:true  },
  { id:"n5", type:"goal",        icon:Zap,           color:C.mint,   title:"Savings streak! 🔥",       body:"You've hit your monthly savings target!",             time:"2 days ago",   read:true  },
  { id:"n6", type:"system",      icon:Info,          color:C.blue,   title:"Statement ready",          body:"Your May 2026 account statement is available",        time:"8 days ago",   read:true  },
  { id:"n7", type:"transaction", icon:ArrowLeftRight,color:C.blue,   title:"Transfer complete",        body:"$1,500.00 moved to High-Yield Savings",               time:"9 days ago",   read:true  },
  { id:"n8", type:"security",    icon:Lock,          color:C.amber,  title:"Password reminder",        body:"You haven't updated your password in 90 days",        time:"12 days ago",  read:true  },
  { id:"n9", type:"transaction", icon:ArrowDownLeft, color:C.mint,   title:"Interest credited",        body:"$38.54 interest added to High-Yield Savings (4.85% APY)","time":"9 days ago",read:true },
  { id:"n10",type:"goal",        icon:CheckCheck,    color:C.mint,   title:"Emergency Fund: 93% done!",body:"Just $1,250 more to reach your $20,000 goal",         time:"13 days ago",  read:true  },
];

// Security mock data
const SESSIONS = [
  { id:"s1", device:"MacBook Pro 14-inch", Icon:Laptop,    browser:"Chrome 125", location:"San Francisco, CA", lastActive:"Active now",  current:true  },
  { id:"s2", device:"iPhone 15 Pro",   Icon:Smartphone,browser:"Safari",     location:"San Francisco, CA", lastActive:"2 hours ago", current:false },
  { id:"s3", device:"Windows PC",      Icon:Monitor,   browser:"Edge 124",   location:"San Jose, CA",      lastActive:"4 days ago",  current:false },
];
const LOGIN_HISTORY = [
  { id:"l1", action:"Signed in",        device:"Chrome — MacBook Pro", location:"San Francisco, CA", time:"Today, 8:45 AM",   success:true  },
  { id:"l2", action:"Signed in",        device:"Safari — iPhone 15",   location:"San Francisco, CA", time:"Jun 7, 6:30 PM",   success:true  },
  { id:"l3", action:"Sign-in blocked",  device:"Unknown device",        location:"Lagos, Nigeria",    time:"Jun 5, 3:12 AM",   success:false },
  { id:"l4", action:"Signed in",        device:"Chrome — MacBook Pro", location:"San Francisco, CA", time:"Jun 4, 9:00 AM",   success:true  },
  { id:"l5", action:"Password changed", device:"Chrome — MacBook Pro", location:"San Francisco, CA", time:"May 28, 2:15 PM",  success:true  },
];

// ─── HELPERS ─────────────────────────────────────────────────
const fmt   = n => new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:2}).format(n);
const fmtD  = d => new Intl.DateTimeFormat("en-US",{month:"short",day:"numeric"}).format(new Date(d));
const mask  = n => `**** ${n.slice(-4)}`;
const pct   = (c,t) => Math.min(100,Math.round((c/t)*100));
const dleft = d => { if(!d) return null; const x=Math.ceil((new Date(d)-new Date())/86400000); return x>0?x:0; };
const ACCT_ICON = { CHECKING:Building2, SAVINGS:Wallet, CREDIT:CreditCard };

const NAV = [
  { id:"overview",     label:"Overview",     Icon:LayoutDashboard },
  { id:"transactions", label:"Transactions", Icon:ListOrdered     },
  { id:"transfers",    label:"Transfers",    Icon:ArrowLeftRight  },
  { id:"goals",        label:"Goals",        Icon:Target          },
];
const INSIGHT_NAV = [
  { id:"analytics",     label:"Analytics",     Icon:BarChart3  },
  { id:"security",      label:"Security",      Icon:ShieldCheck },
];
const ALL_PAGES = new Set(["overview","transactions","transfers","goals","analytics","security","notifications","settings"]);

// ─── PRIMITIVES ──────────────────────────────────────────────
function Btn({ children, onClick, variant="primary", size="md", disabled, fullWidth, style={} }) {
  const T = useT();
  const base = { display:"inline-flex",alignItems:"center",justifyContent:"center",gap:7,fontFamily:"inherit",fontWeight:600,cursor:disabled?"not-allowed":"pointer",border:"none",transition:"all 0.15s ease",opacity:disabled?0.45:1,borderRadius:10,outline:"none",lineHeight:1,whiteSpace:"nowrap",width:fullWidth?"100%":"auto" };
  const sizes = { sm:{padding:"7px 14px",fontSize:12}, md:{padding:"10px 20px",fontSize:14}, lg:{padding:"13px 28px",fontSize:15} };
  const vars  = { primary:{background:C.mint,color:C.navy}, secondary:{background:T.surfaceL,color:T.text.s,border:`1px solid ${T.border}`}, destructive:{background:"rgba(255,77,79,0.1)",color:C.red,border:"1px solid rgba(255,77,79,0.25)"}, ghost:{background:"transparent",color:T.text.m} };
  return <button onClick={onClick} disabled={disabled} style={{...base,...sizes[size],...vars[variant],...style}}>{children}</button>;
}

function Pill({ children, active, onClick, color }) {
  const T = useT();
  return <button onClick={onClick} style={{padding:"5px 13px",borderRadius:999,fontSize:11,fontWeight:500,fontFamily:"inherit",cursor:"pointer",whiteSpace:"nowrap",transition:"all 0.15s ease",background:active?(color?`${color}22`:"rgba(0,200,150,0.15)"):T.surfaceL,color:active?(color||C.mint):T.text.m,border:`1px solid ${active?(color||C.mint):T.border}`}}>{children}</button>;
}

function Progress({ value, color=C.mint }) {
  const v = Math.min(100,Math.max(0,value));
  return <div style={{width:"100%",height:7,background:"rgba(128,128,128,0.15)",borderRadius:999,overflow:"hidden"}}><div style={{height:"100%",width:`${v}%`,background:v>=100?C.red:color,borderRadius:999,transition:"width 0.7s ease"}}/></div>;
}

function Toast({ message, onClose }) {
  useEffect(()=>{ const t=setTimeout(onClose,3500); return ()=>clearTimeout(t); },[onClose]);
  return <div style={{position:"fixed",bottom:80,right:24,zIndex:9999,background:"rgba(0,200,150,0.12)",border:`1px solid ${C.mint}`,borderRadius:12,padding:"12px 18px",display:"flex",alignItems:"center",gap:10,backdropFilter:"blur(16px)",color:C.mint,fontSize:13,fontWeight:500,maxWidth:320,animation:"toastIn 0.3s ease"}}><Check size={15}/>{message}</div>;
}

function CategoryBadge({ cat }) {
  const MAP = { SALARY:{bg:"rgba(0,200,150,0.12)",color:C.mint}, FOOD:{bg:"rgba(245,158,11,0.12)",color:C.amber}, RENT:{bg:"rgba(45,156,219,0.12)",color:C.blue}, UTILITIES:{bg:"rgba(99,102,241,0.12)",color:"#6366F1"}, TRANSPORT:{bg:"rgba(245,158,11,0.12)",color:C.amber}, SUBSCRIPTION:{bg:"rgba(139,92,246,0.12)",color:C.purple}, ENTERTAINMENT:{bg:"rgba(236,72,153,0.12)",color:"#EC4899"}, SHOPPING:{bg:"rgba(255,77,79,0.12)",color:C.red}, HEALTHCARE:{bg:"rgba(16,185,129,0.12)",color:"#10B981"}, TRANSFER:{bg:"rgba(45,156,219,0.12)",color:C.blue}, OTHER:{bg:"rgba(128,128,128,0.12)",color:"#94a3b8"} };
  const s = MAP[cat]||MAP.OTHER;
  return <span style={{display:"inline-block",padding:"2px 8px",borderRadius:999,fontSize:10,fontWeight:600,letterSpacing:"0.04em",background:s.bg,color:s.color}}>{cat}</span>;
}

function ThemeToggle({ isDark, onToggle }) {
  const T = useT();
  return <button onClick={onToggle} title={isDark?"Switch to light mode":"Switch to dark mode"} style={{background:T.surfaceL,border:`1px solid ${T.border}`,borderRadius:8,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",width:32,height:32,color:T.text.s,transition:"all 0.2s ease",flexShrink:0}}>{isDark?<Sun size={15} color={C.amber}/>:<Moon size={15} color={C.blue}/>}</button>;
}

function Toggle({ checked, onChange }) {
  return (
    <button onClick={()=>onChange(!checked)} style={{width:44,height:24,borderRadius:12,border:"none",cursor:"pointer",background:checked?C.mint:"rgba(128,128,128,0.25)",position:"relative",transition:"background 0.25s ease",flexShrink:0,outline:"none"}}>
      <span style={{position:"absolute",top:3,left:checked?23:3,width:18,height:18,borderRadius:"50%",background:"white",transition:"left 0.25s ease",boxShadow:"0 1px 3px rgba(0,0,0,0.2)"}}/>
    </button>
  );
}

function SecurityRing({ score }) {
  const T = useT();
  const r = 52, circ = 2*Math.PI*r, offset = circ*(1-score/100);
  const color = score>=80?C.mint:score>=60?C.amber:C.red;
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10}}>
      <svg width={136} height={136} viewBox="0 0 136 136">
        <circle cx="68" cy="68" r={r} fill="none" stroke={T.surfaceL} strokeWidth="11"/>
        <circle cx="68" cy="68" r={r} fill="none" stroke={color} strokeWidth="11"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round" transform="rotate(-90 68 68)"
          style={{transition:"stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)"}}/>
        <text x="68" y="63" textAnchor="middle" fill={T.text.p} fontSize="30" fontWeight="700" fontFamily="Inter,sans-serif">{score}</text>
        <text x="68" y="83" textAnchor="middle" fill={T.text.m} fontSize="12" fontFamily="Inter,sans-serif">out of 100</text>
      </svg>
      <p style={{fontSize:14,fontWeight:600,color,margin:0}}>{score>=80?"Excellent Security":score>=60?"Good Standing":"Needs Attention"}</p>
    </div>
  );
}

// ─── SIDEBAR ─────────────────────────────────────────────────
function SidebarContent({ page, setPage, user, onLogout, onClose, isDark, onToggle }) {
  const T = useT();
  const go = id=>{ setPage(id); onClose?.(); };
  const navBtn = (id,label,Icon,isInsight=false) => {
    const active = page===id;
    return (
      <button key={id} onClick={()=>go(id)} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:10,background:active?"rgba(0,200,150,0.1)":"transparent",boxShadow:active?`inset 3px 0 0 ${C.mint}`:"none",border:"none",cursor:"pointer",width:"100%",textAlign:"left",color:active?T.text.p:T.text.m,fontSize:14,fontWeight:active?600:500,transition:"all 0.15s ease",fontFamily:"inherit"}}>
        <Icon size={16} color={active?C.mint:T.text.m}/>{label}
      </button>
    );
  };
  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%",padding:"16px 12px",overflowY:"auto"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24}}>
        <div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>go("overview")}>
          <LogoMark size={34}/>
          <div>
            <div style={{fontWeight:700,color:T.text.p,fontSize:15,letterSpacing:"-0.01em"}}>Finvault</div>
            <div style={{fontSize:10,color:T.text.m,letterSpacing:"0.06em"}}>PERSONAL FINANCE</div>
          </div>
        </div>
        <div style={{display:"flex",gap:6}}>
          <ThemeToggle isDark={isDark} onToggle={onToggle}/>
          {onClose&&<button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:T.text.m,display:"flex",alignItems:"center",padding:6,borderRadius:8}}><X size={18}/></button>}
        </div>
      </div>
      <nav style={{flex:1,display:"flex",flexDirection:"column",gap:2}}>
        <p style={{fontSize:10,fontWeight:500,color:T.text.m,letterSpacing:"0.08em",textTransform:"uppercase",padding:"0 8px",marginBottom:6}}>Main</p>
        {NAV.map(({id,label,Icon})=>navBtn(id,label,Icon))}
        <p style={{fontSize:10,fontWeight:500,color:T.text.m,letterSpacing:"0.08em",textTransform:"uppercase",padding:"0 8px",marginTop:16,marginBottom:6}}>Insights</p>
        {INSIGHT_NAV.map(({id,label,Icon})=>navBtn(id,label,Icon,true))}
      </nav>
      <div style={{borderTop:`1px solid ${T.border}`,paddingTop:12,marginTop:12}}>
        {[{id:"notifications",label:"Notifications",Icon:Bell,dot:true},{id:"settings",label:"Settings",Icon:Settings}].map(({id,label,Icon,dot})=>(
          <button key={id} onClick={()=>go(id)} style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"8px 12px",borderRadius:10,background:page===id?"rgba(0,200,150,0.08)":"transparent",border:"none",cursor:"pointer",color:page===id?T.text.p:T.text.m,fontSize:13,fontWeight:page===id?600:500,fontFamily:"inherit",transition:"all .15s"}}>
            <Icon size={15} color={page===id?C.mint:T.text.m}/>{label}
            {dot&&<span style={{marginLeft:"auto",width:7,height:7,borderRadius:"50%",background:C.red,display:"block"}}/>}
          </button>
        ))}
        <div style={{marginTop:8,padding:"10px 12px",borderRadius:12,background:T.surfaceL,border:`1px solid ${T.border}`,display:"flex",alignItems:"center",gap:10}}>
          <div style={{position:"relative",flexShrink:0}}>
            <div style={{width:32,height:32,borderRadius:"50%",background:T.avatarBg,border:`1px solid ${T.borderM}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:600,color:T.text.s}}>AC</div>
            <span style={{position:"absolute",bottom:0,right:0,width:9,height:9,background:C.mint,borderRadius:"50%",border:`2px solid ${T.bg}`}}/>
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:13,fontWeight:600,color:T.text.p,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user.name}</div>
            <div style={{fontSize:11,color:T.text.m,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user.email}</div>
          </div>
          <button onClick={onLogout} style={{background:"none",border:"none",cursor:"pointer",color:T.text.m,display:"flex",alignItems:"center",padding:4,borderRadius:6,flexShrink:0}}><LogOut size={14}/></button>
        </div>
      </div>
    </div>
  );
}

function MobileHeader({ onOpen, isDark, onToggle }) {
  const T = useT();
  return (
    <>
      {/* Left: hamburger */}
      <button onClick={onOpen} style={{background:"none",border:"none",cursor:"pointer",color:T.text.s,display:"flex",alignItems:"center",padding:8,borderRadius:8,flexShrink:0}}>
        <Menu size={22}/>
      </button>

      {/* Right: theme toggle + user box */}
      <div style={{display:"flex",alignItems:"center",gap:8,marginLeft:"auto"}}>
        <ThemeToggle isDark={isDark} onToggle={onToggle}/>
        {/* Alex Chen / Premium box */}
        <div style={{display:"flex",alignItems:"center",gap:8,padding:"5px 10px 5px 6px",background:T.surfaceL,border:`1px solid ${T.border}`,borderRadius:10,flexShrink:0}}>
          <div style={{width:28,height:28,borderRadius:"50%",background:"linear-gradient(135deg,#00C896,#2D9CDB)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"white",flexShrink:0}}>AC</div>
          <div style={{display:"flex",flexDirection:"column",gap:1}}>
            <span style={{fontSize:12,fontWeight:600,color:T.text.p,whiteSpace:"nowrap",lineHeight:1}}>Alex Chen</span>
            <span style={{fontSize:10,color:C.mint,fontWeight:500,lineHeight:1}}>Premium</span>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── DESKTOP TOP HEADER ───────────────────────────────────────
function DesktopHeader({ page, user, isDark, onToggle, onLogout }) {
  const T = useT();
  const PAGE_TITLES = {
    overview:"Dashboard", transactions:"Transactions", transfers:"Transfers",
    goals:"Savings Goals", analytics:"Analytics", security:"Security",
    notifications:"Notifications", settings:"Settings",
  };
  const PAGE_SUBS = {
    overview:"Here's your financial overview for today.",
    transactions:"View and filter your transaction history.",
    transfers:"Move money between your accounts instantly.",
    goals:"Track progress toward your financial milestones.",
    analytics:"Deep insights into your financial patterns.",
    security:"Manage your account security settings.",
    notifications:"Stay up to date with your account activity.",
    settings:"Manage your account preferences.",
  };
  return (
    <div className="fv-desk-hdr" style={{background:T.headerBg, borderBottomColor:T.border}}>
      {/* Page title */}
      <div style={{flex:1,minWidth:0}}>
        <h1 style={{fontSize:20,fontWeight:700,color:T.text.p,margin:0,letterSpacing:"-0.02em",lineHeight:1.2}}>{PAGE_TITLES[page]||"Dashboard"}</h1>
        <p style={{fontSize:12,color:T.text.m,margin:0,lineHeight:1}}>{PAGE_SUBS[page]||""}</p>
      </div>

      {/* Search bar */}
      <div style={{position:"relative",flex:"0 0 260px"}}>
        <svg style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.text.m} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input placeholder="Search transactions, goals..." style={{width:"100%",background:T.surfaceL,border:`1px solid ${T.border}`,borderRadius:10,padding:"8px 14px 8px 34px",fontSize:13,color:T.text.p,fontFamily:"inherit",outline:"none",boxSizing:"border-box"}}/>
      </div>

      {/* Right controls */}
      <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
        {/* Filter by */}
        {page==="overview" && <>
          <button style={{display:"flex",alignItems:"center",gap:6,padding:"7px 14px",background:T.surfaceL,border:`1px solid ${T.border}`,borderRadius:9,cursor:"pointer",fontSize:12,fontWeight:500,color:T.text.s,fontFamily:"inherit",transition:"all .2s"}}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
            Filter by
          </button>
          <button style={{display:"flex",alignItems:"center",gap:6,padding:"7px 14px",background:T.surfaceL,border:`1px solid ${T.border}`,borderRadius:9,cursor:"pointer",fontSize:12,fontWeight:500,color:T.text.s,fontFamily:"inherit",transition:"all .2s"}}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Exports ▾
          </button>
        </>}

        {/* Theme toggle */}
        <ThemeToggle isDark={isDark} onToggle={onToggle}/>

        {/* Notification bell */}
        <button style={{position:"relative",background:T.surfaceL,border:`1px solid ${T.border}`,borderRadius:9,width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:T.text.s,flexShrink:0}}>
          <Bell size={16}/>
          <span style={{position:"absolute",top:7,right:7,width:7,height:7,borderRadius:"50%",background:C.red,border:`1.5px solid ${T.headerBg}`}}/>
        </button>

        {/* User avatar */}
        <div style={{display:"flex",alignItems:"center",gap:10,padding:"5px 12px 5px 6px",background:T.surfaceL,border:`1px solid ${T.border}`,borderRadius:10,cursor:"pointer"}}>
          <div style={{width:28,height:28,borderRadius:"50%",background:"linear-gradient(135deg,#00C896,#2D9CDB)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"white",flexShrink:0}}>AC</div>
          <div style={{minWidth:0}}>
            <p style={{fontSize:12,fontWeight:600,color:T.text.p,margin:0,whiteSpace:"nowrap"}}>{user.name}</p>
            <p style={{fontSize:10,color:T.text.m,margin:0,whiteSpace:"nowrap"}}>Premium</p>
          </div>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={T.text.m} strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
      </div>
    </div>
  );
}

function DrawerSidebar({ isOpen, onClose, page, setPage, user, onLogout, isDark, onToggle }) {
  const T = useT();
  useEffect(()=>{
    if(!isOpen) return;
    const prev=document.body.style.overflow; document.body.style.overflow="hidden";
    const fn=e=>{ if(e.key==="Escape") onClose(); };
    document.addEventListener("keydown",fn);
    return ()=>{ document.body.style.overflow=prev; document.removeEventListener("keydown",fn); };
  },[isOpen,onClose]);
  if(!isOpen) return null;
  return (
    <>
      <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:200,background:"rgba(0,0,0,0.6)",backdropFilter:"blur(4px)",WebkitBackdropFilter:"blur(4px)",animation:"fadeIn 0.2s ease"}}/>
      <div role="dialog" aria-modal="true" style={{position:"fixed",top:0,left:0,bottom:0,width:264,zIndex:201,background:T.surfaceSolid,borderRight:`1px solid ${T.border}`,animation:"slideInLeft 0.25s ease",overflowY:"auto"}}>
        <SidebarContent page={page} setPage={setPage} user={user} onLogout={onLogout} onClose={onClose} isDark={isDark} onToggle={onToggle}/>
      </div>
    </>
  );
}

function BottomNav({ page, setPage }) {
  const T = useT();
  return (
    <div style={{display:"flex",width:"100%"}}>
      {NAV.map(({id,label,Icon})=>{
        const active=page===id;
        return <button key={id} onClick={()=>setPage(id)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4,padding:"10px 4px",background:"none",border:"none",cursor:"pointer",color:active?C.mint:T.text.m,fontSize:10,fontWeight:active?600:500,fontFamily:"inherit",minHeight:56,transition:"color 0.15s ease",position:"relative"}}>
          {active&&<span style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:24,height:3,background:C.mint,borderRadius:"0 0 4px 4px"}}/>}
          <Icon size={active?20:18} style={{transform:active?"scale(1.1)":"scale(1)",transition:"transform .15s"}}/>
          <span>{label}</span>
        </button>;
      })}
    </div>
  );
}

// ─── AUTH PAGES ──────────────────────────────────────────────
function LoginPage({ onLogin, onGoRegister, isDark, onToggle }) {
  const T = useT();
  const [email,setEmail]=useState(DEMO.email); const [pw,setPw]=useState(DEMO.password);
  const [show,setShow]=useState(false); const [err,setErr]=useState(""); const [loading,setLoading]=useState(false);
  const submit = async()=>{ setErr(""); setLoading(true); await new Promise(r=>setTimeout(r,750)); if(email===DEMO.email&&pw===DEMO.password){onLogin({name:"Alex Chen",email,initials:"AC"});}else{setErr("Invalid credentials. Use the demo credentials pre-filled above.");} setLoading(false); };
  const inp={width:"100%",background:T.inputBg,border:`1px solid ${T.border}`,borderRadius:10,padding:"11px 14px",color:T.text.p,fontSize:14,fontFamily:"inherit",outline:"none",boxSizing:"border-box"};
  return (
    <div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:24,position:"relative"}}>
      <div style={{position:"absolute",top:16,right:16}}><ThemeToggle isDark={isDark} onToggle={onToggle}/></div>
      <div style={{width:"100%",maxWidth:420}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{display:"flex",justifyContent:"center",marginBottom:14}}><LogoMark size={52}/></div>
          <h1 style={{fontSize:26,fontWeight:700,color:T.text.p,margin:0}}>Welcome back</h1>
          <p style={{fontSize:14,color:T.text.m,margin:"6px 0 0"}}>Sign in to your Finvault account</p>
        </div>
        <div style={{background:"rgba(0,200,150,0.07)",border:"1px solid rgba(0,200,150,0.22)",borderRadius:10,padding:"10px 14px",marginBottom:16,display:"flex",gap:10,alignItems:"flex-start"}}>
          <span style={{fontSize:15,marginTop:1}}>✨</span>
          <div>
            <p style={{fontSize:12,color:C.mint,fontWeight:600,margin:"0 0 2px"}}>Demo credentials pre-filled</p>
            <p style={{fontSize:11,color:T.text.m,margin:0,fontFamily:"monospace"}}>{DEMO.email} · {DEMO.password}</p>
          </div>
        </div>
        <div style={{...T.glass(),padding:24,display:"flex",flexDirection:"column",gap:16}}>
          {err&&<div style={{background:"rgba(255,77,79,0.1)",border:"1px solid rgba(255,77,79,0.25)",borderRadius:8,padding:"10px 14px",color:C.red,fontSize:13,display:"flex",alignItems:"center",gap:8}}><AlertTriangle size={14}/>{err}</div>}
          <div>
            <label style={{display:"block",fontSize:11,fontWeight:500,color:T.text.m,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.07em"}}>Email address</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} style={inp} placeholder="you@example.com"/>
          </div>
          <div>
            <label style={{display:"block",fontSize:11,fontWeight:500,color:T.text.m,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.07em"}}>Password</label>
            <div style={{position:"relative"}}>
              <input type={show?"text":"password"} value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} style={{...inp,paddingRight:44}} placeholder="••••••••"/>
              <button onClick={()=>setShow(!show)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:T.text.m,display:"flex",alignItems:"center"}}>{show?<EyeOff size={15}/>:<Eye size={15}/>}</button>
            </div>
          </div>
          <Btn onClick={submit} disabled={loading} size="lg" fullWidth style={{marginTop:4}}>{loading?"Signing in…":"Sign in →"}</Btn>
        </div>
        <p style={{textAlign:"center",fontSize:13,color:T.text.m,marginTop:14}}>No account? <button onClick={onGoRegister} style={{background:"none",border:"none",cursor:"pointer",color:C.mint,fontWeight:600,fontSize:13,fontFamily:"inherit"}}>Create one</button></p>
      </div>
    </div>
  );
}

function RegisterPage({ onGoLogin, isDark, onToggle }) {
  const T = useT();
  const inp={width:"100%",background:T.inputBg,border:`1px solid ${T.border}`,borderRadius:10,padding:"11px 14px",color:T.text.p,fontSize:14,fontFamily:"inherit",outline:"none",boxSizing:"border-box"};
  return (
    <div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:24,position:"relative"}}>
      <div style={{position:"absolute",top:16,right:16}}><ThemeToggle isDark={isDark} onToggle={onToggle}/></div>
      <div style={{width:"100%",maxWidth:420}}>
        <div style={{textAlign:"center",marginBottom:24}}>
          <div style={{display:"flex",justifyContent:"center",marginBottom:14}}><LogoMark size={52}/></div>
          <h1 style={{fontSize:26,fontWeight:700,color:T.text.p,margin:0}}>Create account</h1>
          <p style={{fontSize:14,color:T.text.m,margin:"6px 0 0"}}>Start your financial journey</p>
        </div>
        <div style={{...T.glass(),padding:24,display:"flex",flexDirection:"column",gap:14}}>
          {[{label:"Full name",type:"text",ph:"Alex Chen"},{label:"Email address",type:"email",ph:"you@example.com"},{label:"Password",type:"password",ph:"Min. 8 chars, 1 number"},{label:"Confirm password",type:"password",ph:"Must match above"}].map(({label,type,ph})=>(
            <div key={label}>
              <label style={{display:"block",fontSize:11,fontWeight:500,color:T.text.m,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.07em"}}>{label}</label>
              <input type={type} style={inp} placeholder={ph}/>
            </div>
          ))}
          <div style={{background:`${C.blue}12`,border:`1px solid ${C.blue}33`,borderRadius:8,padding:"10px 14px"}}>
            <p style={{fontSize:12,color:C.blue,margin:0}}>ℹ️ Portfolio demo — use the login page with pre-filled credentials to explore the full app.</p>
          </div>
          <Btn onClick={onGoLogin} size="lg" fullWidth variant="secondary">← Back to Login</Btn>
        </div>
      </div>
    </div>
  );
}

// ─── CHIP SVG ────────────────────────────────────────────────
function ChipIcon() {
  return (
    <svg width="44" height="34" viewBox="0 0 44 34" fill="none">
      <rect x="1" y="1" width="42" height="32" rx="5" fill="#D4AA4A" stroke="#B8922A" strokeWidth="0.5"/>
      <rect x="14" y="1" width="2" height="32" fill="#B8922A" opacity="0.6"/>
      <rect x="28" y="1" width="2" height="32" fill="#B8922A" opacity="0.6"/>
      <rect x="1" y="11" width="42" height="2" fill="#B8922A" opacity="0.6"/>
      <rect x="1" y="21" width="42" height="2" fill="#B8922A" opacity="0.6"/>
      <rect x="14" y="11" width="16" height="12" rx="2" fill="#C9A030" stroke="#B8922A" strokeWidth="0.5"/>
    </svg>
  );
}

// ─── MASTERCARD LOGO ─────────────────────────────────────────
function MastercardIcon({ size=38 }) {
  return (
    <svg width={size} height={size*0.63} viewBox="0 0 38 24">
      <circle cx="14" cy="12" r="12" fill="#EB001B"/>
      <circle cx="24" cy="12" r="12" fill="#F79E1B"/>
      <path d="M19 4.8A12 12 0 0 1 23.5 12 12 12 0 0 1 19 19.2 12 12 0 0 1 14.5 12 12 12 0 0 1 19 4.8z" fill="#FF5F00"/>
    </svg>
  );
}

// ─── VISA LOGO ───────────────────────────────────────────────
function VisaIcon({ size=44 }) {
  return (
    <svg width={size} height={size*0.32} viewBox="0 0 44 14">
      <text x="0" y="12" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="14" fontStyle="italic" fill="white" letterSpacing="-0.5">VISA</text>
    </svg>
  );
}

// ─── ATM BANK CARD ────────────────────────────────────────────
const ATM_THEMES = {
  CHECKING: {
    grad: "linear-gradient(135deg, #3B5BDB 0%, #5C7CFA 50%, #74C0FC 100%)",
    wave1: "rgba(255,255,255,0.10)", wave2: "rgba(255,255,255,0.06)",
    accent: "#74C0FC", network: "mastercard", label: "Checking Account",
  },
  SAVINGS: {
    grad: "linear-gradient(135deg, #0F9B58 0%, #00C896 55%, #96F2D7 100%)",
    wave1: "rgba(255,255,255,0.12)", wave2: "rgba(255,255,255,0.06)",
    accent: "#96F2D7", network: "visa", label: "Savings Account",
  },
  CREDIT: {
    grad: "linear-gradient(135deg, #7048E8 0%, #9775FA 55%, #D0BFFF 100%)",
    wave1: "rgba(255,255,255,0.10)", wave2: "rgba(255,255,255,0.06)",
    accent: "#D0BFFF", network: "mastercard", label: "Credit Card",
  },
};

function ATMCard({ account, hidden }) {
  const theme = ATM_THEMES[account.type] || ATM_THEMES.CHECKING;
  const neg = account.balance < 0;
  const displayBal = hidden ? "••••••" : fmt(Math.abs(account.balance));

  return (
    <div className="atm-card rise rise-1" style={{
      background: theme.grad,
      borderRadius: 22,
      padding: "22px 24px 20px",
      minHeight: 190,
      display: "flex", flexDirection: "column", justifyContent: "space-between",
      position: "relative", overflow: "hidden",
      boxShadow: "0 8px 24px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.14)",
      userSelect: "none",
    }}>
      {/* Decorative wave circles */}
      <div style={{position:"absolute",top:-55,right:-55,width:180,height:180,borderRadius:"50%",background:theme.wave1,pointerEvents:"none"}}/>
      <div style={{position:"absolute",top:-20,right:-20,width:120,height:120,borderRadius:"50%",background:theme.wave2,pointerEvents:"none"}}/>
      <div style={{position:"absolute",bottom:-40,left:-30,width:160,height:160,borderRadius:"50%",background:theme.wave1,pointerEvents:"none"}}/>

      {/* Top row: label + chip */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",position:"relative",zIndex:1}}>
        <div>
          <p style={{fontSize:10,fontWeight:500,color:"rgba(255,255,255,0.65)",margin:"0 0 2px",letterSpacing:"0.1em",textTransform:"uppercase"}}>{theme.label}</p>
          <p style={{fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.85)",margin:0,letterSpacing:"0.04em"}}>{account.nickname}</p>
        </div>
        <ChipIcon/>
      </div>

      {/* Balance */}
      <div style={{position:"relative",zIndex:1}}>
        <p style={{fontSize:10,color:"rgba(255,255,255,0.6)",margin:"0 0 4px",letterSpacing:"0.06em",textTransform:"uppercase"}}>Available Balance</p>
        <p style={{fontSize:26,fontWeight:700,color:"white",margin:0,letterSpacing:"-0.02em",fontVariantNumeric:"tabular-nums",textShadow:"0 2px 8px rgba(0,0,0,0.2)"}}>
          {neg && !hidden && <span style={{fontSize:16,opacity:0.8}}>-</span>}{displayBal}
        </p>
      </div>

      {/* Bottom row: card number + network */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",position:"relative",zIndex:1}}>
        <div>
          <p style={{fontSize:12,color:"rgba(255,255,255,0.7)",margin:"0 0 6px",fontFamily:"monospace",letterSpacing:"0.18em"}}>
            {hidden ? "•••• •••• •••• ••••" : `•••• •••• •••• ${account.number.slice(-4)}`}
          </p>
          <p style={{fontSize:10,color:"rgba(255,255,255,0.55)",margin:0,letterSpacing:"0.04em"}}>ALEX CHEN</p>
        </div>
        {theme.network === "mastercard" ? <MastercardIcon size={42}/> : <VisaIcon size={48}/>}
      </div>
    </div>
  );
}

// ─── TX ROW (full description, mobile-safe) ───────────────────
function TxRow({ tx }) {
  const T = useT(); const isIn=tx.type==="DEPOSIT"; const isTr=tx.type==="TRANSFER";
  return (
    <div style={{display:"flex",alignItems:"flex-start",gap:12,padding:"13px 0",borderBottom:`1px solid ${T.border}`}}>
      <div style={{width:38,height:38,borderRadius:11,flexShrink:0,background:isIn?"rgba(0,200,150,0.12)":isTr?"rgba(45,156,219,0.12)":"rgba(255,77,79,0.12)",display:"flex",alignItems:"center",justifyContent:"center",border:`1px solid ${isIn?"rgba(0,200,150,0.2)":isTr?"rgba(45,156,219,0.2)":"rgba(255,77,79,0.2)"}`}}>
        {isIn?<ArrowDownLeft size={16} color={C.mint}/>:isTr?<ArrowLeftRight size={16} color={C.blue}/>:<ArrowUpRight size={16} color={C.red}/>}
      </div>
      <div style={{flex:1,minWidth:0}}>
        <p style={{fontSize:13,fontWeight:500,color:T.text.p,margin:"0 0 3px",lineHeight:1.4,wordBreak:"break-word"}}>{tx.description}</p>
        <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
          <p style={{fontSize:11,color:T.text.m,margin:0}}>{fmtD(tx.date)}</p>
          <CategoryBadge cat={tx.category}/>
        </div>
      </div>
      <p style={{fontSize:14,fontWeight:700,margin:0,color:isIn?C.mint:isTr?C.blue:C.red,fontVariantNumeric:"tabular-nums",flexShrink:0,paddingTop:2}}>
        {isIn?"+":"-"}{fmt(tx.amount)}
      </p>
    </div>
  );
}

// ─── WALLET HERO ──────────────────────────────────────────────
function WalletHero({ netWorth, income, expenses, hidden, onToggleHidden }) {
  const savingsRate = income > 0 ? Math.round(((income - expenses) / income) * 100) : 0;
  return (
    <div style={{
      borderRadius: 22,
      background: "linear-gradient(145deg, #0D2137 0%, #1A3A5C 45%, #0F2A45 100%)",
      padding: "22px 20px 20px",
      position: "relative", overflow: "hidden",
      boxShadow: "0 8px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.08)",
    }}>
      {/* Glow blobs */}
      <div className="hero-glow" style={{position:"absolute",top:-60,right:-40,width:220,height:220,borderRadius:"50%",background:"radial-gradient(circle,rgba(0,200,150,0.16) 0%,transparent 70%)",pointerEvents:"none"}}/>
      <div className="hero-glow" style={{position:"absolute",bottom:-70,left:-50,width:240,height:240,borderRadius:"50%",background:"radial-gradient(circle,rgba(45,156,219,0.13) 0%,transparent 70%)",pointerEvents:"none",animationDelay:"2.5s"}}/>

      {/* Purse icon */}
      <div style={{position:"absolute",top:16,right:18,opacity:0.1}}>
        <svg width="60" height="60" viewBox="0 0 72 72" fill="white">
          <path d="M28 20c0-4.4 3.6-8 8-8s8 3.6 8 8H52c2.2 0 4 1.8 4 4v30c0 2.2-1.8 4-4 4H20c-2.2 0-4-1.8-4-4V24c0-2.2 1.8-4 4-4h8zm8-4c-2.2 0-4 1.8-4 4h8c0-2.2-1.8-4-4-4zm8 20H28c-1.1 0-2 .9-2 2s.9 2 2 2h16c1.1 0 2-.9 2-2s-.9-2-2-2z"/>
        </svg>
      </div>

      {/* Header row */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,position:"relative",zIndex:1}}>
        <p style={{fontSize:11,fontWeight:500,color:"rgba(255,255,255,0.5)",margin:0,letterSpacing:"0.1em",textTransform:"uppercase"}}>Total Net Worth</p>
        <button onClick={onToggleHidden} style={{background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:8,cursor:"pointer",display:"flex",alignItems:"center",gap:5,padding:"4px 10px",color:"rgba(255,255,255,0.7)",fontSize:11,fontWeight:500,fontFamily:"inherit",transition:"all 0.2s",flexShrink:0}}>
          {hidden ? <Eye size={12}/> : <EyeOff size={12}/>}
          {hidden ? "Show" : "Hide"}
        </button>
      </div>

      {/* Net worth number — scales down to fit on small screens */}
      <div style={{marginBottom:20,position:"relative",zIndex:1}}>
        <p style={{fontSize:"clamp(22px, 6vw, 36px)",fontWeight:800,color:"white",margin:0,letterSpacing:"-0.02em",fontVariantNumeric:"tabular-nums",lineHeight:1,wordBreak:"break-all"}}>
          {hidden ? <span style={{letterSpacing:"0.15em",fontSize:"clamp(18px,5vw,28px)"}}>••••••••</span> : fmt(netWorth)}
        </p>
        <div style={{display:"flex",alignItems:"center",gap:6,marginTop:8,flexWrap:"wrap"}}>
          <span style={{display:"inline-flex",alignItems:"center",gap:4,background:"rgba(0,200,150,0.2)",border:"1px solid rgba(0,200,150,0.3)",borderRadius:999,padding:"3px 8px",fontSize:10,fontWeight:600,color:C.mint,whiteSpace:"nowrap"}}>
            <TrendingUp size={10}/> +2.4% this month
          </span>
          <span style={{fontSize:10,color:"rgba(255,255,255,0.4)",whiteSpace:"nowrap"}}>Updated just now</span>
        </div>
      </div>

      {/* Income / Expense / Savings — scrollable on very small screens */}
      <div style={{display:"flex",gap:0,position:"relative",zIndex:1,overflowX:"auto",scrollbarWidth:"none"}}>
        {[
          {label:"Income",  value:income,                                   color:"#4ADE80", sub:"Jun deposits" },
          {label:"Expenses",value:expenses,                                  color:"#F87171", sub:"Jun spending" },
          {label:"Saved",   value:income-expenses>0?income-expenses:0,      color:C.blue,    sub:`${savingsRate}% rate`},
        ].map((item,i) => (
          <div key={i} style={{flex:"0 0 auto",minWidth:80,padding:"0 12px",textAlign:"center",borderLeft:i>0?"1px solid rgba(255,255,255,0.1)":undefined}}>
            <p style={{fontSize:10,color:"rgba(255,255,255,0.45)",margin:"0 0 4px",letterSpacing:"0.05em",textTransform:"uppercase",whiteSpace:"nowrap"}}>{item.label}</p>
            <p style={{fontSize:"clamp(12px,3.5vw,15px)",fontWeight:700,color:item.color,margin:"0 0 2px",fontVariantNumeric:"tabular-nums",whiteSpace:"nowrap"}}>
              {hidden ? "••••" : fmt(item.value)}
            </p>
            <p style={{fontSize:10,color:"rgba(255,255,255,0.35)",margin:0,whiteSpace:"nowrap"}}>{item.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MODAL SHELL ─────────────────────────────────────────────
function Modal({ title, subtitle, icon: Icon, iconColor, onClose, children }) {
  const T = useT();
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const fn = e => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", fn);
    return () => { document.body.style.overflow = prev; document.removeEventListener("keydown", fn); };
  }, [onClose]);
  return (
    <>
      <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:300,background:"rgba(0,0,0,0.65)",backdropFilter:"blur(6px)",WebkitBackdropFilter:"blur(6px)",animation:"fadeIn 0.2s ease"}}/>
      <div role="dialog" aria-modal="true" style={{position:"fixed",top:"50%",left:"50%",transform:"translate(-50%,-50%)",zIndex:301,width:"min(480px,calc(100vw - 32px))",maxHeight:"calc(100dvh - 48px)",overflowY:"auto",background:T.surfaceSolid,border:`1px solid ${T.border}`,borderRadius:20,boxShadow:"0 32px 80px rgba(0,0,0,0.5)",animation:"scale-in 0.2s ease"}}>
        {/* Header */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"20px 24px 0"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:40,height:40,borderRadius:12,background:`${iconColor}18`,border:`1px solid ${iconColor}30`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <Icon size={18} color={iconColor}/>
            </div>
            <div>
              <p style={{fontSize:16,fontWeight:700,color:T.text.p,margin:0,letterSpacing:"-0.01em"}}>{title}</p>
              {subtitle && <p style={{fontSize:12,color:T.text.m,margin:0}}>{subtitle}</p>}
            </div>
          </div>
          <button onClick={onClose} style={{background:T.surfaceL,border:`1px solid ${T.border}`,borderRadius:8,width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:T.text.m,flexShrink:0}}>
            <X size={15}/>
          </button>
        </div>
        {/* Body */}
        <div style={{padding:"20px 24px 24px"}}>{children}</div>
      </div>
    </>
  );
}

// ─── MODAL CONTENTS ───────────────────────────────────────────
function PayBillModal({ onClose, accounts, showToast }) {
  const T = useT();
  const [biller,setBiller] = useState(""); const [acct,setAcct] = useState(accounts[0]?.id||""); const [amount,setAmount] = useState(""); const [done,setDone] = useState(false);
  const billers = ["Comcast Xfinity","PG&E Electric & Gas","AT&T Wireless","Water Utilities","Netflix","Spotify","Amazon Prime","Credit Card"];
  const inp = {width:"100%",background:T.inputBg,border:`1px solid ${T.border}`,borderRadius:10,padding:"10px 14px",color:T.text.p,fontSize:14,fontFamily:"inherit",outline:"none",boxSizing:"border-box"};
  const submit = () => {
    if(!biller||!amount||parseFloat(amount)<=0) return;
    setDone(true); setTimeout(()=>{ showToast(`Bill paid: ${fmt(parseFloat(amount))} to ${biller}`); onClose(); },1200);
  };
  return done ? (
    <div style={{textAlign:"center",padding:"20px 0",display:"flex",flexDirection:"column",alignItems:"center",gap:14}}>
      <div style={{width:60,height:60,borderRadius:"50%",background:"rgba(0,200,150,0.12)",border:`2px solid ${C.mint}`,display:"flex",alignItems:"center",justifyContent:"center"}}><Check size={26} color={C.mint}/></div>
      <p style={{fontSize:16,fontWeight:700,color:T.text.p,margin:0}}>Bill payment sent!</p>
      <p style={{fontSize:13,color:T.text.m,margin:0}}>{fmt(parseFloat(amount))} to {biller}</p>
    </div>
  ) : (
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div><label style={{display:"block",fontSize:11,fontWeight:500,color:T.text.m,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.07em"}}>Select biller</label>
        <select value={biller} onChange={e=>setBiller(e.target.value)} style={inp}><option value="">Choose a biller…</option>{billers.map(b=><option key={b} value={b}>{b}</option>)}</select></div>
      <div><label style={{display:"block",fontSize:11,fontWeight:500,color:T.text.m,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.07em"}}>Pay from</label>
        <select value={acct} onChange={e=>setAcct(e.target.value)} style={inp}>{accounts.map(a=><option key={a.id} value={a.id}>{a.nickname} — {fmt(a.balance)}</option>)}</select></div>
      <div><label style={{display:"block",fontSize:11,fontWeight:500,color:T.text.m,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.07em"}}>Amount (USD)</label>
        <div style={{position:"relative"}}><span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:T.text.m}}>$</span>
        <input type="number" value={amount} onChange={e=>setAmount(e.target.value)} style={{...inp,paddingLeft:28}} placeholder="0.00"/></div></div>
      <Btn onClick={submit} disabled={!biller||!amount} size="lg" fullWidth><CreditCard size={15}/>Pay Bill</Btn>
    </div>
  );
}

function TopUpModal({ onClose, accounts, showToast }) {
  const T = useT();
  const [phone,setPhone] = useState(""); const [network,setNetwork] = useState(""); const [amount,setAmount] = useState(""); const [acct,setAcct] = useState(accounts[0]?.id||""); const [done,setDone] = useState(false);
  const networks = ["AT&T","Verizon","T-Mobile","Sprint","Boost Mobile","Cricket Wireless"];
  const presets = [5,10,15,20,25,50];
  const inp = {width:"100%",background:T.inputBg,border:`1px solid ${T.border}`,borderRadius:10,padding:"10px 14px",color:T.text.p,fontSize:14,fontFamily:"inherit",outline:"none",boxSizing:"border-box"};
  const submit = () => {
    if(!phone||!network||!amount) return;
    setDone(true); setTimeout(()=>{ showToast(`$${amount} top-up sent to ${phone}`); onClose(); },1200);
  };
  return done ? (
    <div style={{textAlign:"center",padding:"20px 0",display:"flex",flexDirection:"column",alignItems:"center",gap:14}}>
      <div style={{width:60,height:60,borderRadius:"50%",background:"rgba(0,200,150,0.12)",border:`2px solid ${C.mint}`,display:"flex",alignItems:"center",justifyContent:"center"}}><Check size={26} color={C.mint}/></div>
      <p style={{fontSize:16,fontWeight:700,color:T.text.p,margin:0}}>Top-up successful!</p>
      <p style={{fontSize:13,color:T.text.m,margin:0}}>${amount} added to {phone}</p>
    </div>
  ) : (
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div><label style={{display:"block",fontSize:11,fontWeight:500,color:T.text.m,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.07em"}}>Phone number</label>
        <input type="tel" value={phone} onChange={e=>setPhone(e.target.value)} style={inp} placeholder="+1 (555) 000-0000"/></div>
      <div><label style={{display:"block",fontSize:11,fontWeight:500,color:T.text.m,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.07em"}}>Network</label>
        <select value={network} onChange={e=>setNetwork(e.target.value)} style={inp}><option value="">Select network…</option>{networks.map(n=><option key={n} value={n}>{n}</option>)}</select></div>
      <div><label style={{display:"block",fontSize:11,fontWeight:500,color:T.text.m,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.07em"}}>Amount</label>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:8}}>{presets.map(p=><button key={p} onClick={()=>setAmount(String(p))} style={{padding:"6px 14px",borderRadius:8,border:`1px solid ${amount===String(p)?C.mint:T.border}`,background:amount===String(p)?"rgba(0,200,150,0.12)":T.surfaceL,color:amount===String(p)?C.mint:T.text.m,fontFamily:"inherit",fontSize:12,fontWeight:500,cursor:"pointer"}}>${p}</button>)}</div>
        <div style={{position:"relative"}}><span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:T.text.m}}>$</span>
        <input type="number" value={amount} onChange={e=>setAmount(e.target.value)} style={{...inp,paddingLeft:28}} placeholder="Custom amount"/></div></div>
      <div><label style={{display:"block",fontSize:11,fontWeight:500,color:T.text.m,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.07em"}}>From account</label>
        <select value={acct} onChange={e=>setAcct(e.target.value)} style={inp}>{accounts.map(a=><option key={a.id} value={a.id}>{a.nickname} — {fmt(a.balance)}</option>)}</select></div>
      <Btn onClick={submit} disabled={!phone||!network||!amount} size="lg" fullWidth><Zap size={15}/>Send Top-Up</Btn>
    </div>
  );
}

function RechargeModal({ onClose, accounts, showToast }) {
  return <TopUpModal onClose={onClose} accounts={accounts} showToast={showToast}/>;
}

function CharityModal({ onClose, accounts, showToast }) {
  const T = useT();
  const [org,setOrg] = useState(""); const [amount,setAmount] = useState(""); const [acct,setAcct] = useState(accounts[0]?.id||""); const [msg,setMsg] = useState(""); const [done,setDone] = useState(false);
  const orgs = ["Red Cross","UNICEF","Doctors Without Borders","World Food Programme","Save the Children","Habitat for Humanity","WWF","Local Food Bank"];
  const inp = {width:"100%",background:T.inputBg,border:`1px solid ${T.border}`,borderRadius:10,padding:"10px 14px",color:T.text.p,fontSize:14,fontFamily:"inherit",outline:"none",boxSizing:"border-box"};
  const submit = () => {
    if(!org||!amount) return;
    setDone(true); setTimeout(()=>{ showToast(`Donation of ${fmt(parseFloat(amount))} sent to ${org} 💝`); onClose(); },1200);
  };
  return done ? (
    <div style={{textAlign:"center",padding:"20px 0",display:"flex",flexDirection:"column",alignItems:"center",gap:14}}>
      <span style={{fontSize:48}}>💝</span>
      <p style={{fontSize:16,fontWeight:700,color:T.text.p,margin:0}}>Thank you for giving!</p>
      <p style={{fontSize:13,color:T.text.m,margin:0}}>{fmt(parseFloat(amount))} donated to {org}</p>
    </div>
  ) : (
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div><label style={{display:"block",fontSize:11,fontWeight:500,color:T.text.m,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.07em"}}>Choose organisation</label>
        <select value={org} onChange={e=>setOrg(e.target.value)} style={inp}><option value="">Select charity…</option>{orgs.map(o=><option key={o} value={o}>{o}</option>)}</select></div>
      <div><label style={{display:"block",fontSize:11,fontWeight:500,color:T.text.m,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.07em"}}>Donation amount</label>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:8}}>{[10,25,50,100].map(p=><button key={p} onClick={()=>setAmount(String(p))} style={{padding:"6px 14px",borderRadius:8,border:`1px solid ${amount===String(p)?"#E64980":T.border}`,background:amount===String(p)?"rgba(230,73,128,0.12)":T.surfaceL,color:amount===String(p)?"#E64980":T.text.m,fontFamily:"inherit",fontSize:12,fontWeight:500,cursor:"pointer"}}>${p}</button>)}</div>
        <div style={{position:"relative"}}><span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:T.text.m}}>$</span>
        <input type="number" value={amount} onChange={e=>setAmount(e.target.value)} style={{...inp,paddingLeft:28}} placeholder="Other amount"/></div></div>
      <div><label style={{display:"block",fontSize:11,fontWeight:500,color:T.text.m,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.07em"}}>Message (optional)</label>
        <input value={msg} onChange={e=>setMsg(e.target.value)} style={inp} placeholder="A note with your donation…"/></div>
      <div><label style={{display:"block",fontSize:11,fontWeight:500,color:T.text.m,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.07em"}}>From account</label>
        <select value={acct} onChange={e=>setAcct(e.target.value)} style={inp}>{accounts.map(a=><option key={a.id} value={a.id}>{a.nickname} — {fmt(a.balance)}</option>)}</select></div>
      <Btn onClick={submit} disabled={!org||!amount} size="lg" fullWidth style={{background:"#E64980",color:"white"}}>Donate Now 💝</Btn>
    </div>
  );
}

function LoanModal({ onClose, showToast }) {
  const T = useT();
  const [loanAmt,setLoanAmt] = useState("10000"); const [term,setTerm] = useState("12"); const [purpose,setPurpose] = useState("");
  const purposes = ["Home Improvement","Car Purchase","Education","Medical","Debt Consolidation","Business","Vacation","Other"];
  const rate = 8.5; const monthly = loanAmt && term ? ((parseFloat(loanAmt)*(rate/1200))/( 1-Math.pow(1+rate/1200,-parseInt(term)))).toFixed(2) : "0.00";
  const inp = {width:"100%",background:T.inputBg,border:`1px solid ${T.border}`,borderRadius:10,padding:"10px 14px",color:T.text.p,fontSize:14,fontFamily:"inherit",outline:"none",boxSizing:"border-box"};
  return (
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div style={{background:"rgba(245,158,11,0.08)",border:"1px solid rgba(245,158,11,0.2)",borderRadius:10,padding:"10px 14px"}}>
        <p style={{fontSize:12,color:C.amber,fontWeight:600,margin:"0 0 2px"}}>Personal Loan Calculator</p>
        <p style={{fontSize:11,color:T.text.m,margin:0}}>Rates from 8.5% APR. Subject to credit approval.</p>
      </div>
      <div><label style={{display:"block",fontSize:11,fontWeight:500,color:T.text.m,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.07em"}}>Loan amount</label>
        <div style={{position:"relative"}}><span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:T.text.m}}>$</span>
        <input type="number" value={loanAmt} onChange={e=>setLoanAmt(e.target.value)} style={{...inp,paddingLeft:28}} placeholder="10000"/></div></div>
      <div><label style={{display:"block",fontSize:11,fontWeight:500,color:T.text.m,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.07em"}}>Repayment term</label>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{["6","12","24","36","48","60"].map(t=><button key={t} onClick={()=>setTerm(t)} style={{padding:"6px 14px",borderRadius:8,border:`1px solid ${term===t?C.amber:T.border}`,background:term===t?"rgba(245,158,11,0.12)":T.surfaceL,color:term===t?C.amber:T.text.m,fontFamily:"inherit",fontSize:12,fontWeight:500,cursor:"pointer"}}>{t}mo</button>)}</div></div>
      <div><label style={{display:"block",fontSize:11,fontWeight:500,color:T.text.m,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.07em"}}>Purpose</label>
        <select value={purpose} onChange={e=>setPurpose(e.target.value)} style={inp}><option value="">Select purpose…</option>{purposes.map(p=><option key={p} value={p}>{p}</option>)}</select></div>
      <div style={{background:T.surfaceL,border:`1px solid ${T.border}`,borderRadius:12,padding:"14px 18px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:13,color:T.text.m}}>Estimated monthly payment</span><span style={{fontSize:20,fontWeight:700,color:C.amber,fontVariantNumeric:"tabular-nums"}}>${monthly}</span></div>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:8}}><span style={{fontSize:11,color:T.text.m}}>Interest rate</span><span style={{fontSize:11,color:T.text.s,fontWeight:500}}>{rate}% APR</span></div>
      </div>
      <Btn onClick={()=>{ showToast("Loan application submitted! We'll review within 24h."); onClose(); }} disabled={!loanAmt||!purpose} size="lg" fullWidth style={{background:C.amber,color:C.navy}}>Apply for Loan</Btn>
    </div>
  );
}

function GiftsModal({ onClose, accounts, showToast }) {
  const T = useT();
  const [recipient,setRecipient] = useState(""); const [amount,setAmount] = useState(""); const [acct,setAcct] = useState(accounts[0]?.id||""); const [msg,setMsg] = useState(""); const [done,setDone] = useState(false);
  const inp = {width:"100%",background:T.inputBg,border:`1px solid ${T.border}`,borderRadius:10,padding:"10px 14px",color:T.text.p,fontSize:14,fontFamily:"inherit",outline:"none",boxSizing:"border-box"};
  const submit = () => { if(!recipient||!amount) return; setDone(true); setTimeout(()=>{ showToast(`🎁 Gift of ${fmt(parseFloat(amount))} sent to ${recipient}!`); onClose(); },1200); };
  return done ? (
    <div style={{textAlign:"center",padding:"20px 0",display:"flex",flexDirection:"column",alignItems:"center",gap:14}}>
      <span style={{fontSize:56}}>🎁</span>
      <p style={{fontSize:16,fontWeight:700,color:T.text.p,margin:0}}>Gift sent!</p>
      <p style={{fontSize:13,color:T.text.m,margin:0}}>{fmt(parseFloat(amount))} to {recipient}</p>
    </div>
  ) : (
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div><label style={{display:"block",fontSize:11,fontWeight:500,color:T.text.m,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.07em"}}>Recipient name or email</label>
        <input value={recipient} onChange={e=>setRecipient(e.target.value)} style={inp} placeholder="Jane Smith or jane@email.com"/></div>
      <div><label style={{display:"block",fontSize:11,fontWeight:500,color:T.text.m,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.07em"}}>Gift amount</label>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:8}}>{[20,50,100,200].map(p=><button key={p} onClick={()=>setAmount(String(p))} style={{padding:"6px 14px",borderRadius:8,border:`1px solid ${amount===String(p)?"#7048E8":T.border}`,background:amount===String(p)?"rgba(112,72,232,0.12)":T.surfaceL,color:amount===String(p)?"#7048E8":T.text.m,fontFamily:"inherit",fontSize:12,fontWeight:500,cursor:"pointer"}}>${p}</button>)}</div>
        <div style={{position:"relative"}}><span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:T.text.m}}>$</span>
        <input type="number" value={amount} onChange={e=>setAmount(e.target.value)} style={{...inp,paddingLeft:28}} placeholder="Custom amount"/></div></div>
      <div><label style={{display:"block",fontSize:11,fontWeight:500,color:T.text.m,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.07em"}}>Personal message (optional)</label>
        <textarea value={msg} onChange={e=>setMsg(e.target.value)} rows={3} style={{...inp,resize:"vertical"}} placeholder="Happy birthday! 🎉"/></div>
      <div><label style={{display:"block",fontSize:11,fontWeight:500,color:T.text.m,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.07em"}}>From account</label>
        <select value={acct} onChange={e=>setAcct(e.target.value)} style={inp}>{accounts.map(a=><option key={a.id} value={a.id}>{a.nickname} — {fmt(a.balance)}</option>)}</select></div>
      <Btn onClick={submit} disabled={!recipient||!amount} size="lg" fullWidth style={{background:"#7048E8",color:"white"}}>Send Gift 🎁</Btn>
    </div>
  );
}

function InsuranceModal({ onClose, showToast }) {
  const T = useT();
  const [type,setType] = useState("");
  const plans = {
    Health:[{name:"Basic",price:"$89/mo",cover:"$500k"},{name:"Standard",price:"$149/mo",cover:"$1M"},{name:"Premium",price:"$229/mo",cover:"$2M"}],
    Life:[{name:"Term 10yr",price:"$24/mo",cover:"$250k"},{name:"Term 20yr",price:"$38/mo",cover:"$500k"},{name:"Whole Life",price:"$95/mo",cover:"$1M"}],
    Auto:[{name:"Basic",price:"$62/mo",cover:"Liability"},{name:"Full Cover",price:"$112/mo",cover:"Comprehensive"},{name:"Premium",price:"$158/mo",cover:"All-inclusive"}],
    Home:[{name:"Essential",price:"$45/mo",cover:"$300k"},{name:"Standard",price:"$79/mo",cover:"$600k"},{name:"Premium",price:"$125/mo",cover:"$1M+"}],
  };
  return (
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        {Object.keys(plans).map(t=><button key={t} onClick={()=>setType(t)} style={{padding:"7px 16px",borderRadius:9,border:`1px solid ${type===t?"#10B981":T.border}`,background:type===t?"rgba(16,185,129,0.12)":T.surfaceL,color:type===t?"#10B981":T.text.m,fontFamily:"inherit",fontSize:12,fontWeight:500,cursor:"pointer"}}>{t}</button>)}
      </div>
      {type ? (
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {plans[type].map(p=>(
            <div key={p.name} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 16px",background:T.surfaceL,border:`1px solid ${T.border}`,borderRadius:12}}>
              <div><p style={{fontSize:14,fontWeight:600,color:T.text.p,margin:"0 0 3px"}}>{p.name}</p><p style={{fontSize:11,color:T.text.m,margin:0}}>Coverage: {p.cover}</p></div>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:14,fontWeight:700,color:"#10B981"}}>{p.price}</span>
                <Btn onClick={()=>{ showToast(`${type} ${p.name} plan selected! An agent will contact you.`); onClose(); }} size="sm">Select</Btn>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{textAlign:"center",padding:"24px 0",color:T.text.m,fontSize:13}}>Select an insurance type above to see plans</div>
      )}
    </div>
  );
}

function TravelModal({ onClose, accounts, showToast }) {
  const T = useT();
  const [dest,setDest] = useState(""); const [budget,setBudget] = useState(""); const [dep,setDep] = useState(""); const [ret,setRet] = useState(""); const [acct,setAcct] = useState(accounts[0]?.id||"");
  const destinations = ["Paris, France","Tokyo, Japan","New York, USA","Bali, Indonesia","London, UK","Dubai, UAE","Rome, Italy","Cancun, Mexico"];
  const inp = {width:"100%",background:T.inputBg,border:`1px solid ${T.border}`,borderRadius:10,padding:"10px 14px",color:T.text.p,fontSize:14,fontFamily:"inherit",outline:"none",boxSizing:"border-box"};
  return (
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div><label style={{display:"block",fontSize:11,fontWeight:500,color:T.text.m,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.07em"}}>Destination</label>
        <select value={dest} onChange={e=>setDest(e.target.value)} style={inp}><option value="">Choose destination…</option>{destinations.map(d=><option key={d} value={d}>{d}</option>)}</select></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <div><label style={{display:"block",fontSize:11,fontWeight:500,color:T.text.m,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.07em"}}>Departure</label><input type="date" value={dep} onChange={e=>setDep(e.target.value)} style={{...inp,colorScheme:"dark"}}/></div>
        <div><label style={{display:"block",fontSize:11,fontWeight:500,color:T.text.m,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.07em"}}>Return</label><input type="date" value={ret} onChange={e=>setRet(e.target.value)} style={{...inp,colorScheme:"dark"}}/></div>
      </div>
      <div><label style={{display:"block",fontSize:11,fontWeight:500,color:T.text.m,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.07em"}}>Travel budget</label>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:8}}>{[500,1000,2000,5000].map(p=><button key={p} onClick={()=>setBudget(String(p))} style={{padding:"6px 14px",borderRadius:8,border:`1px solid ${budget===String(p)?C.blue:T.border}`,background:budget===String(p)?"rgba(45,156,219,0.12)":T.surfaceL,color:budget===String(p)?C.blue:T.text.m,fontFamily:"inherit",fontSize:12,fontWeight:500,cursor:"pointer"}}>${p}</button>)}</div>
        <div style={{position:"relative"}}><span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:T.text.m}}>$</span>
        <input type="number" value={budget} onChange={e=>setBudget(e.target.value)} style={{...inp,paddingLeft:28}} placeholder="Custom budget"/></div></div>
      <div><label style={{display:"block",fontSize:11,fontWeight:500,color:T.text.m,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.07em"}}>Reserve funds from</label>
        <select value={acct} onChange={e=>setAcct(e.target.value)} style={inp}>{accounts.map(a=><option key={a.id} value={a.id}>{a.nickname} — {fmt(a.balance)}</option>)}</select></div>
      <Btn onClick={()=>{ if(!dest||!budget) return; showToast(`✈️ Travel funds reserved for ${dest}!`); onClose(); }} disabled={!dest||!budget} size="lg" fullWidth style={{background:C.blue,color:"white"}}>Reserve Travel Funds ✈️</Btn>
    </div>
  );
}

function MortgageModal({ onClose, showToast }) {
  const T = useT();
  const [propVal,setPropVal] = useState("400000"); const [down,setDown] = useState("80000"); const [termY,setTermY] = useState("30");
  const rate = 6.8;
  const principal = Math.max(0, parseFloat(propVal||0) - parseFloat(down||0));
  const monthlyRate = rate / 1200;
  const n = parseInt(termY) * 12;
  const monthly = principal > 0 && n > 0 ? ((principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -n))).toFixed(2) : "0.00";
  const downPct = propVal ? Math.round((parseFloat(down||0)/parseFloat(propVal))*100) : 0;
  const inp = {width:"100%",background:T.inputBg,border:`1px solid ${T.border}`,borderRadius:10,padding:"10px 14px",color:T.text.p,fontSize:14,fontFamily:"inherit",outline:"none",boxSizing:"border-box"};
  return (
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div style={{background:"rgba(247,103,7,0.08)",border:"1px solid rgba(247,103,7,0.2)",borderRadius:10,padding:"10px 14px"}}><p style={{fontSize:12,color:"#F76707",fontWeight:600,margin:"0 0 2px"}}>Mortgage Calculator</p><p style={{fontSize:11,color:T.text.m,margin:0}}>Current rate: {rate}% APR. Results are estimates.</p></div>
      <div><label style={{display:"block",fontSize:11,fontWeight:500,color:T.text.m,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.07em"}}>Property value</label>
        <div style={{position:"relative"}}><span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:T.text.m}}>$</span>
        <input type="number" value={propVal} onChange={e=>setPropVal(e.target.value)} style={{...inp,paddingLeft:28}}/></div></div>
      <div><label style={{display:"block",fontSize:11,fontWeight:500,color:T.text.m,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.07em"}}>Down payment <span style={{color:"#F76707",fontWeight:600}}>({downPct}%)</span></label>
        <div style={{position:"relative"}}><span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:T.text.m}}>$</span>
        <input type="number" value={down} onChange={e=>setDown(e.target.value)} style={{...inp,paddingLeft:28}}/></div></div>
      <div><label style={{display:"block",fontSize:11,fontWeight:500,color:T.text.m,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.07em"}}>Loan term</label>
        <div style={{display:"flex",gap:8}}>{["10","15","20","30"].map(t=><button key={t} onClick={()=>setTermY(t)} style={{flex:1,padding:"8px 0",borderRadius:9,border:`1px solid ${termY===t?"#F76707":T.border}`,background:termY===t?"rgba(247,103,7,0.12)":T.surfaceL,color:termY===t?"#F76707":T.text.m,fontFamily:"inherit",fontSize:12,fontWeight:500,cursor:"pointer"}}>{t}yr</button>)}</div></div>
      <div style={{background:T.surfaceL,border:`1px solid ${T.border}`,borderRadius:12,padding:"16px 18px"}}>
        <p style={{fontSize:11,color:T.text.m,margin:"0 0 4px",textTransform:"uppercase",letterSpacing:"0.06em"}}>Monthly payment</p>
        <p style={{fontSize:28,fontWeight:800,color:"#F76707",margin:"0 0 8px",fontVariantNumeric:"tabular-nums"}}>${monthly}</p>
        <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:11,color:T.text.m}}>Loan amount</span><span style={{fontSize:11,color:T.text.s,fontWeight:500}}>{fmt(principal)}</span></div>
      </div>
      <Btn onClick={()=>{ showToast("Mortgage enquiry submitted! A specialist will call you."); onClose(); }} size="lg" fullWidth style={{background:"#F76707",color:"white"}}>Enquire Now 🏠</Btn>
    </div>
  );
}

function InvestModal({ onClose, accounts, showToast }) {
  const T = useT();
  const [asset,setAsset] = useState(""); const [amount,setAmount] = useState(""); const [acct,setAcct] = useState(accounts[0]?.id||""); const [done,setDone] = useState(false);
  const assets = [
    {name:"S&P 500 Index",symbol:"SPY",change:"+12.4%",risk:"Low"},
    {name:"Tech Growth ETF",symbol:"QQQ",change:"+18.2%",risk:"Medium"},
    {name:"Bitcoin",symbol:"BTC",change:"+62.1%",risk:"High"},
    {name:"Gold ETF",symbol:"GLD",change:"+8.3%",risk:"Low"},
    {name:"Real Estate REIT",symbol:"VNQ",change:"+5.7%",risk:"Low"},
    {name:"Emerging Markets",symbol:"EEM",change:"+9.8%",risk:"Medium"},
  ];
  const riskColor = r => r==="Low"?C.mint:r==="Medium"?C.amber:C.red;
  const inp = {width:"100%",background:T.inputBg,border:`1px solid ${T.border}`,borderRadius:10,padding:"10px 14px",color:T.text.p,fontSize:14,fontFamily:"inherit",outline:"none",boxSizing:"border-box"};
  const submit = () => { if(!asset||!amount) return; setDone(true); setTimeout(()=>{ showToast(`📊 Invested ${fmt(parseFloat(amount))} in ${asset}!`); onClose(); },1200); };
  return done ? (
    <div style={{textAlign:"center",padding:"20px 0",display:"flex",flexDirection:"column",alignItems:"center",gap:14}}>
      <span style={{fontSize:52}}>📈</span>
      <p style={{fontSize:16,fontWeight:700,color:T.text.p,margin:0}}>Investment placed!</p>
      <p style={{fontSize:13,color:T.text.m,margin:0}}>{fmt(parseFloat(amount))} invested in {asset}</p>
    </div>
  ) : (
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {assets.map(a=>(
          <div key={a.symbol} onClick={()=>setAsset(a.name)} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 14px",background:asset===a.name?"rgba(0,200,150,0.1)":T.surfaceL,border:`1px solid ${asset===a.name?C.mint:T.border}`,borderRadius:12,cursor:"pointer",transition:"all 0.15s"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:36,height:36,borderRadius:9,background:T.inputBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:C.mint,fontFamily:"monospace"}}>{a.symbol}</div>
              <div><p style={{fontSize:13,fontWeight:500,color:T.text.p,margin:0}}>{a.name}</p><span style={{fontSize:10,padding:"1px 6px",borderRadius:999,background:`${riskColor(a.risk)}15`,color:riskColor(a.risk)}}>{a.risk} risk</span></div>
            </div>
            <span style={{fontSize:13,fontWeight:700,color:C.mint}}>{a.change}</span>
          </div>
        ))}
      </div>
      {asset && <>
        <div><label style={{display:"block",fontSize:11,fontWeight:500,color:T.text.m,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.07em"}}>Amount to invest</label>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:8}}>{[100,500,1000,5000].map(p=><button key={p} onClick={()=>setAmount(String(p))} style={{padding:"6px 14px",borderRadius:8,border:`1px solid ${amount===String(p)?C.mint:T.border}`,background:amount===String(p)?"rgba(0,200,150,0.12)":T.surfaceL,color:amount===String(p)?C.mint:T.text.m,fontFamily:"inherit",fontSize:12,fontWeight:500,cursor:"pointer"}}>${p}</button>)}</div>
          <div style={{position:"relative"}}><span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:T.text.m}}>$</span>
          <input type="number" value={amount} onChange={e=>setAmount(e.target.value)} style={{...inp,paddingLeft:28}} placeholder="Custom amount"/></div></div>
        <div><label style={{display:"block",fontSize:11,fontWeight:500,color:T.text.m,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.07em"}}>From account</label>
          <select value={acct} onChange={e=>setAcct(e.target.value)} style={inp}>{accounts.map(a=><option key={a.id} value={a.id}>{a.nickname} — {fmt(a.balance)}</option>)}</select></div>
        <Btn onClick={submit} disabled={!amount} size="lg" fullWidth>📊 Invest Now</Btn>
      </>}
    </div>
  );
}

// ─── QUICK ACTIONS ────────────────────────────────────────────
function QuickActions({ setPage, accounts, showToast }) {
  const T = useT();
  const [modal, setModal] = useState(null);
  const actions = [
    {icon:ArrowLeftRight, label:"Transfer",  color:"#3B5BDB", bg:"rgba(59,91,219,0.15)",  onClick:()=>setPage("transfers")     },
    {icon:CreditCard,     label:"Pay Bill",  color:"#7048E8", bg:"rgba(112,72,232,0.15)", onClick:()=>setModal("paybill")      },
    {icon:ArrowDownLeft,  label:"Top Up",    color:C.mint,    bg:"rgba(0,200,150,0.15)",  onClick:()=>setModal("topup")        },
    {icon:BarChart3,      label:"Analytics", color:"#F59E0B", bg:"rgba(245,158,11,0.15)", onClick:()=>setPage("analytics")     },
    {icon:Target,         label:"Goals",     color:"#EC4899", bg:"rgba(236,72,153,0.15)", onClick:()=>setPage("goals")         },
    {icon:ShieldCheck,    label:"Security",  color:"#10B981", bg:"rgba(16,185,129,0.15)", onClick:()=>setPage("security")      },
  ];
  return (
    <>
      <div>
        <h2 style={{fontSize:15,fontWeight:700,color:T.text.p,margin:"0 0 14px",letterSpacing:"-0.01em"}}>Quick Actions</h2>
        <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:4,scrollbarWidth:"none",WebkitOverflowScrolling:"touch"}}>
          {actions.map(({icon:Icon,label,color,bg,onClick})=>(
            <button key={label} onClick={onClick} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8,padding:"14px 10px",background:T.glass().background,border:`1px solid ${T.border}`,borderRadius:16,cursor:"pointer",transition:"all 0.2s ease",fontFamily:"inherit",flexShrink:0,minWidth:76}}>
              <div style={{width:44,height:44,borderRadius:14,background:bg,display:"flex",alignItems:"center",justifyContent:"center",border:`1px solid ${color}30`}}><Icon size={20} color={color}/></div>
              <span style={{fontSize:10,fontWeight:500,color:T.text.m,textAlign:"center",lineHeight:1.2,whiteSpace:"nowrap"}}>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {modal==="paybill" && <Modal title="Pay Bill" subtitle="Pay utilities, subscriptions & more" icon={CreditCard} iconColor="#7048E8" onClose={()=>setModal(null)}><PayBillModal onClose={()=>setModal(null)} accounts={accounts} showToast={showToast}/></Modal>}
      {modal==="topup"   && <Modal title="Top Up" subtitle="Recharge any mobile number instantly" icon={ArrowDownLeft} iconColor={C.mint} onClose={()=>setModal(null)}><TopUpModal onClose={()=>setModal(null)} accounts={accounts} showToast={showToast}/></Modal>}
    </>
  );
}

// ─── SERVICES ─────────────────────────────────────────────────
function Services({ accounts, showToast }) {
  const T = useT();
  const [modal, setModal] = useState(null);
  const items = [
    {emoji:"📱", label:"Recharge",  color:"#3B5BDB", key:"recharge" },
    {emoji:"💝", label:"Charity",   color:"#E64980", key:"charity"  },
    {emoji:"💰", label:"Loan",      color:"#F59E0B", key:"loan"     },
    {emoji:"🎁", label:"Gifts",     color:"#7048E8", key:"gifts"    },
    {emoji:"🛡️", label:"Insurance", color:"#10B981", key:"insurance"},
    {emoji:"✈️", label:"Travel",    color:"#2D9CDB", key:"travel"   },
    {emoji:"🏠", label:"Mortgage",  color:"#F76707", key:"mortgage" },
    {emoji:"📊", label:"Invest",    color:"#00C896", key:"invest"   },
  ];
  const MODAL_CONFIG = {
    recharge:  {title:"Mobile Recharge",     subtitle:"Top up any phone number",          icon:ArrowDownLeft, color:"#3B5BDB"},
    charity:   {title:"Charity Donation",    subtitle:"Give back to a cause you love",    icon:Plus,          color:"#E64980"},
    loan:      {title:"Personal Loan",       subtitle:"Fast approval, flexible terms",    icon:ArrowLeftRight,color:"#F59E0B"},
    gifts:     {title:"Send a Gift",         subtitle:"Surprise someone special",         icon:Star,          color:"#7048E8"},
    insurance: {title:"Insurance Plans",     subtitle:"Protect what matters most",        icon:ShieldCheck,   color:"#10B981"},
    travel:    {title:"Travel Funds",        subtitle:"Reserve budget for your next trip",icon:TrendingUp,    color:"#2D9CDB"},
    mortgage:  {title:"Mortgage Calculator", subtitle:"Estimate your home loan payments", icon:Building2,     color:"#F76707"},
    invest:    {title:"Invest",              subtitle:"Grow your wealth over time",        icon:BarChart3,     color:"#00C896"},
  };
  const cfg = modal ? MODAL_CONFIG[modal] : null;
  return (
    <>
      <div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <h2 style={{fontSize:15,fontWeight:700,color:T.text.p,margin:0,letterSpacing:"-0.01em"}}>Services</h2>
          <button style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:C.mint,fontWeight:500,fontFamily:"inherit"}}>See all →</button>
        </div>
        <div style={{display:"flex",gap:10,overflowX:"auto",paddingBottom:4,scrollbarWidth:"none"}}>
          {items.map(({emoji,label,color,key})=>(
            <button key={key} onClick={()=>setModal(key)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8,padding:"14px 16px",background:T.glass().background,border:`1px solid ${T.border}`,borderRadius:16,cursor:"pointer",flexShrink:0,transition:"all 0.2s ease",fontFamily:"inherit",minWidth:72}}>
              <div style={{width:46,height:46,borderRadius:"50%",background:`${color}15`,border:`1px solid ${color}25`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{emoji}</div>
              <span style={{fontSize:10,fontWeight:500,color:T.text.m,whiteSpace:"nowrap"}}>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {cfg && (
        <Modal title={cfg.title} subtitle={cfg.subtitle} icon={cfg.icon} iconColor={cfg.color} onClose={()=>setModal(null)}>
          {modal==="recharge"  && <RechargeModal  onClose={()=>setModal(null)} accounts={accounts} showToast={showToast}/>}
          {modal==="charity"   && <CharityModal   onClose={()=>setModal(null)} accounts={accounts} showToast={showToast}/>}
          {modal==="loan"      && <LoanModal      onClose={()=>setModal(null)} showToast={showToast}/>}
          {modal==="gifts"     && <GiftsModal     onClose={()=>setModal(null)} accounts={accounts} showToast={showToast}/>}
          {modal==="insurance" && <InsuranceModal onClose={()=>setModal(null)} showToast={showToast}/>}
          {modal==="travel"    && <TravelModal    onClose={()=>setModal(null)} accounts={accounts} showToast={showToast}/>}
          {modal==="mortgage"  && <MortgageModal  onClose={()=>setModal(null)} showToast={showToast}/>}
          {modal==="invest"    && <InvestModal    onClose={()=>setModal(null)} accounts={accounts} showToast={showToast}/>}
        </Modal>
      )}
    </>
  );
}

// ─── OVERVIEW PAGE ────────────────────────────────────────────
function OverviewPage({ accounts, transactions, setPage, showToast }) {
  const T = useT();
  const [hidden, setHidden] = useState(false);
  const netWorth=accounts.reduce((s,a)=>s+a.balance,0);
  const thisMonth=transactions.filter(t=>new Date(t.date).getMonth()===new Date().getMonth());
  const income=thisMonth.filter(t=>t.type==="DEPOSIT").reduce((s,t)=>s+t.amount,0);
  const expenses=thisMonth.filter(t=>t.type==="WITHDRAWAL").reduce((s,t)=>s+t.amount,0);

  return (
    <div style={{display:"flex",flexDirection:"column",gap:24,overflow:"hidden"}}>

      {/* ── Mobile/tablet page header (hidden on desktop — desktop header handles it) ── */}
      <div className="mob-greeting">
        {/* Row 1: Dashboard title + subtitle */}
        <div style={{marginBottom:10}}>
          <h1 style={{fontSize:22,fontWeight:700,color:T.text.p,margin:"0 0 3px",letterSpacing:"-0.02em"}}>Dashboard</h1>
          <p style={{fontSize:13,color:T.text.m,margin:0}}>Here's your financial overview for today.</p>
        </div>

        {/* Row 2: Filter by + Exports buttons */}
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <button style={{display:"flex",alignItems:"center",gap:6,padding:"7px 14px",background:T.surfaceL,border:`1px solid ${T.border}`,borderRadius:9,cursor:"pointer",fontSize:12,fontWeight:500,color:T.text.s,fontFamily:"inherit"}}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
            Filter by
          </button>
          <button style={{display:"flex",alignItems:"center",gap:6,padding:"7px 14px",background:T.surfaceL,border:`1px solid ${T.border}`,borderRadius:9,cursor:"pointer",fontSize:12,fontWeight:500,color:T.text.s,fontFamily:"inherit"}}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Exports ▾
          </button>
        </div>
      </div>

      {/* ── HERO SPLIT: Cards LEFT | WalletHero RIGHT (desktop) ── */}
      <div className="ov-top">
        {/* LEFT — ATM cards */}
        <div className="ov-left">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <h2 style={{fontSize:15,fontWeight:700,color:T.text.p,margin:0,letterSpacing:"-0.01em"}}>My Cards</h2>
            <span style={{fontSize:11,color:T.text.m}}>Swipe to see all →</span>
          </div>
          {/* desktop: 2×2 grid | mobile: horizontal snap-scroll */}
          <div className="cards-grid">
            {accounts.map((a,i)=>(
              <div key={a.id} className={`rise rise-${i+1}`}>
                <ATMCard account={a} hidden={hidden}/>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Wallet Hero */}
        <div className="ov-right">
          <WalletHero netWorth={netWorth} income={income} expenses={expenses} hidden={hidden} onToggleHidden={()=>setHidden(h=>!h)}/>
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActions setPage={setPage} accounts={accounts} showToast={showToast}/>

      {/* Services */}
      <Services accounts={accounts} showToast={showToast}/>

      {/* Charts */}
      <div className="g-charts">
        <div style={{...T.glass(),padding:"18px 20px"}}>
          <h3 style={{fontSize:14,fontWeight:600,color:T.text.p,margin:"0 0 16px"}}>Cash Flow — 6 Months</h3>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={MONTHLY} margin={{top:4,right:4,left:-28,bottom:0}}>
              <defs>
                <linearGradient id="gIn"  x1="0" y1="0" x2="0" y2="1"><stop offset="5%"  stopColor={C.mint} stopOpacity={0.35}/><stop offset="95%" stopColor={C.mint} stopOpacity={0}/></linearGradient>
                <linearGradient id="gOut" x1="0" y1="0" x2="0" y2="1"><stop offset="5%"  stopColor={C.red}  stopOpacity={0.25}/><stop offset="95%" stopColor={C.red}  stopOpacity={0}/></linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{fill:T.text.m,fontSize:11}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:T.text.m,fontSize:11}} axisLine={false} tickLine={false} tickFormatter={v=>`$${(v/1000).toFixed(0)}k`}/>
              <Tooltip contentStyle={{background:T.surfaceSolid,border:`1px solid ${T.borderM}`,borderRadius:8,fontSize:12,color:T.text.p}} formatter={(v,n)=>[fmt(v),n==="inflow"?"Income":"Expenses"]}/>
              <Area type="monotone" dataKey="inflow"  stroke={C.mint} strokeWidth={2.5} fill="url(#gIn)"/>
              <Area type="monotone" dataKey="outflow" stroke={C.red}  strokeWidth={2.5} fill="url(#gOut)"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div style={{...T.glass(),padding:"18px 20px",display:"flex",flexDirection:"column"}}>
          <h3 style={{fontSize:14,fontWeight:600,color:T.text.p,margin:"0 0 4px"}}>Spending</h3>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={CATEGORY_SPEND} cx="50%" cy="50%" innerRadius={40} outerRadius={62} dataKey="value" paddingAngle={3}>
                {CATEGORY_SPEND.map((e,i)=><Cell key={i} fill={e.color}/>)}
              </Pie>
              <Tooltip contentStyle={{background:T.surfaceSolid,border:`1px solid ${T.borderM}`,borderRadius:8,fontSize:12,color:T.text.p}} formatter={v=>[fmt(v)]}/>
            </PieChart>
          </ResponsiveContainer>
          <div style={{display:"flex",flexWrap:"wrap",gap:"5px 10px"}}>{CATEGORY_SPEND.slice(0,6).map(c=><div key={c.name} style={{display:"flex",alignItems:"center",gap:4}}><span style={{width:7,height:7,borderRadius:"50%",background:c.color,display:"inline-block"}}/><span style={{fontSize:10,color:T.text.m}}>{c.name}</span></div>)}</div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <h2 style={{fontSize:15,fontWeight:700,color:T.text.p,margin:0}}>Recent Transactions</h2>
          <button style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:C.mint,fontWeight:500,fontFamily:"inherit"}}>View all →</button>
        </div>
        <div style={{...T.glass(),padding:"0 20px"}}>
          {transactions.slice(0,7).map(tx=><TxRow key={tx.id} tx={tx}/>)}
        </div>
      </div>
    </div>
  );
}

// ─── TRANSACTIONS PAGE ────────────────────────────────────────
function TransactionsPage({ transactions }) {
  const T = useT();
  const [catF,setCatF]=useState("All"); const [typeF,setTypeF]=useState("All");
  const filtered=useMemo(()=>transactions.filter(tx=>(catF==="All"||tx.category===catF)&&(typeF==="All"||tx.type===typeF)),[transactions,catF,typeF]);
  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div><h1 style={{fontSize:22,fontWeight:700,color:T.text.p,margin:"0 0 4px",letterSpacing:"-0.01em"}}>Transactions</h1><p style={{fontSize:14,color:T.text.m,margin:0}}>{filtered.length} of {transactions.length} transactions</p></div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{["All","DEPOSIT","WITHDRAWAL","TRANSFER"].map(t=><Pill key={t} active={typeF===t} onClick={()=>setTypeF(t)} color={t==="DEPOSIT"?C.mint:t==="WITHDRAWAL"?C.red:t==="TRANSFER"?C.blue:undefined}>{t==="All"?"All types":t.charAt(0)+t.slice(1).toLowerCase()}</Pill>)}</div>
      <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:4}}>{CAT_FILTERS.map(c=><Pill key={c} active={catF===c} onClick={()=>setCatF(c)}>{c==="All"?"All categories":c.charAt(0)+c.slice(1).toLowerCase().replace("_"," ")}</Pill>)}</div>
      <div style={{...T.glass(),padding:"4px 20px"}}>{filtered.length===0?<div style={{textAlign:"center",padding:"40px 0",color:T.text.m,fontSize:14}}>No transactions match your filters.</div>:filtered.map(tx=><TxRow key={tx.id} tx={tx}/>)}</div>
    </div>
  );
}

// ─── TRANSFERS PAGE ───────────────────────────────────────────
function TransfersPage({ accounts, onTransfer }) {
  const T = useT();
  const [step,setStep]=useState(1); const [fromId,setFromId]=useState(accounts[0]?.id||""); const [toId,setToId]=useState(accounts[1]?.id||"");
  const [amount,setAmount]=useState(""); const [note,setNote]=useState(""); const [error,setError]=useState("");
  const fromAcc=accounts.find(a=>a.id===fromId); const toAcc=accounts.find(a=>a.id===toId); const amt=parseFloat(amount)||0;
  const validate=()=>{ if(!fromId||!toId) return "Select both accounts."; if(fromId===toId) return "Source and destination must differ."; if(!amt||amt<=0) return "Enter a valid amount."; if(amt>(fromAcc?.balance??0)) return `Insufficient funds. Available: ${fmt(fromAcc?.balance??0)}`; return ""; };
  const inp={width:"100%",background:T.inputBg,border:`1px solid ${T.border}`,borderRadius:10,padding:"11px 14px",color:T.text.p,fontSize:14,fontFamily:"inherit",outline:"none",boxSizing:"border-box"};
  return (
    <div style={{display:"flex",flexDirection:"column",gap:20,maxWidth:500}}>
      <div><h1 style={{fontSize:22,fontWeight:700,color:T.text.p,margin:"0 0 4px",letterSpacing:"-0.01em"}}>Internal Transfer</h1><p style={{fontSize:14,color:T.text.m,margin:0}}>Move funds between your accounts instantly.</p></div>
      <div style={{display:"flex",alignItems:"center",gap:8}}>{["Details","Confirm","Done"].map((label,i)=>{ const s=i+1,active=step===s,done=step>s; return <Fragment key={s}><div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:26,height:26,borderRadius:"50%",background:done||active?C.mint:T.surfaceL,border:`1px solid ${done||active?C.mint:T.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:done||active?C.navy:T.text.m}}>{done?<Check size={12}/>:s}</div><span style={{fontSize:12,fontWeight:500,color:active?T.text.p:T.text.m}}>{label}</span></div>{i<2&&<div style={{flex:1,height:1,background:done?C.mint:T.border}}/>}</Fragment>; })}</div>
      <div style={{...T.glass(),padding:24}}>
        {step===1&&<div style={{display:"flex",flexDirection:"column",gap:16}}>
          {error&&<div style={{background:"rgba(255,77,79,0.1)",border:"1px solid rgba(255,77,79,0.25)",borderRadius:8,padding:"10px 14px",color:C.red,fontSize:13,display:"flex",alignItems:"center",gap:8}}><AlertTriangle size={14}/>{error}</div>}
          {[{label:"From account",val:fromId,set:setFromId},{label:"To account",val:toId,set:setToId}].map(({label,val,set},i)=>(
            <div key={i}>
              {i===1&&<div style={{display:"flex",justifyContent:"center",marginBottom:16}}><div style={{width:32,height:32,borderRadius:"50%",background:"rgba(45,156,219,0.1)",border:"1px solid rgba(45,156,219,0.2)",display:"flex",alignItems:"center",justifyContent:"center"}}><ArrowLeftRight size={14} color={C.blue}/></div></div>}
              <label style={{display:"block",fontSize:11,fontWeight:500,color:T.text.m,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.07em"}}>{label}</label>
              <select value={val} onChange={e=>set(e.target.value)} style={inp}>{accounts.map(a=><option key={a.id} value={a.id}>{a.nickname} — {fmt(a.balance)}</option>)}</select>
            </div>
          ))}
          <div>
            <label style={{display:"block",fontSize:11,fontWeight:500,color:T.text.m,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.07em"}}>Amount (USD)</label>
            <div style={{position:"relative"}}><span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:T.text.m,fontSize:14}}>$</span><input type="number" value={amount} onChange={e=>setAmount(e.target.value)} min="0.01" step="0.01" style={{...inp,paddingLeft:28}} placeholder="0.00"/></div>
            {fromAcc&&<p style={{fontSize:11,color:T.text.m,margin:"5px 0 0"}}>Available: <span style={{color:C.mint,fontWeight:500}}>{fmt(fromAcc.balance)}</span></p>}
          </div>
          <div>
            <label style={{display:"block",fontSize:11,fontWeight:500,color:T.text.m,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.07em"}}>Note (optional)</label>
            <input type="text" value={note} onChange={e=>setNote(e.target.value)} style={inp} placeholder="e.g. Monthly savings"/>
          </div>
          <Btn onClick={()=>{ const e=validate(); if(e){setError(e);return;} setError(""); setStep(2); }} size="lg" fullWidth style={{marginTop:4}}>Review Transfer →</Btn>
        </div>}
        {step===2&&<div style={{display:"flex",flexDirection:"column",gap:20}}>
          <div style={{textAlign:"center"}}><p style={{fontSize:13,color:T.text.m,margin:"0 0 6px"}}>Transfer amount</p><p style={{fontSize:38,fontWeight:700,color:T.text.p,margin:0,fontVariantNumeric:"tabular-nums",letterSpacing:"-0.02em"}}>{fmt(amt)}</p></div>
          <div style={{background:T.confirmBg,borderRadius:12,padding:16,display:"flex",flexDirection:"column",gap:10,border:`1px solid ${T.border}`}}>
            {[{label:"From",val:`${fromAcc?.nickname} (${mask(fromAcc?.number||"")})`},{label:"To",val:`${toAcc?.nickname} (${mask(toAcc?.number||"")})`},{label:"Note",val:note||"Transfer between accounts"},{label:"New balance (from)",val:fmt((fromAcc?.balance??0)-amt)}].map(({label,val})=>(
              <div key={label} style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:13,color:T.text.m}}>{label}</span><span style={{fontSize:13,fontWeight:500,color:T.text.p}}>{val}</span></div>
            ))}
          </div>
          <div style={{display:"flex",gap:10}}>
            <Btn onClick={()=>setStep(1)} variant="secondary" size="md" style={{flex:1}}>← Back</Btn>
            <Btn onClick={()=>{ onTransfer({fromId,toId,amount:amt}); setStep(3); }} size="md" style={{flex:2}}><ShieldCheck size={15}/> Confirm Transfer</Btn>
          </div>
        </div>}
        {step===3&&<div style={{textAlign:"center",padding:"20px 0",display:"flex",flexDirection:"column",alignItems:"center",gap:14}}>
          <div style={{width:60,height:60,borderRadius:"50%",background:"rgba(0,200,150,0.12)",border:`2px solid ${C.mint}`,display:"flex",alignItems:"center",justifyContent:"center"}}><Check size={26} color={C.mint}/></div>
          <div><p style={{fontSize:18,fontWeight:700,color:T.text.p,margin:"0 0 4px"}}>Transfer complete!</p><p style={{fontSize:13,color:T.text.m,margin:0}}>{fmt(amt)} moved to {toAcc?.nickname}</p></div>
          <Btn onClick={()=>{ setStep(1); setAmount(""); setNote(""); setError(""); }} variant="secondary" size="md">Make another transfer</Btn>
        </div>}
      </div>
    </div>
  );
}

// ─── GOALS PAGE ───────────────────────────────────────────────
function GoalsPage({ goals, accounts, onContribute }) {
  const T = useT();
  const [active,setActive]=useState(null); const [cam,setCam]=useState(""); const [cfrom,setCfrom]=useState(accounts[0]?.id||""); const [cerr,setCerr]=useState("");
  const doC=(goalId)=>{ const amt=parseFloat(cam)||0; const acc=accounts.find(a=>a.id===cfrom); if(!amt||amt<=0){setCerr("Enter a valid amount.");return;} if(amt>(acc?.balance??0)){setCerr("Insufficient funds.");return;} onContribute(goalId,cfrom,amt); setActive(null); setCam(""); setCerr(""); };
  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div><h1 style={{fontSize:22,fontWeight:700,color:T.text.p,margin:"0 0 4px",letterSpacing:"-0.01em"}}>Savings Goals</h1><p style={{fontSize:14,color:T.text.m,margin:0}}>Track progress toward your financial milestones.</p></div>
      <div className="g-goals">
        {goals.map(goal=>{ const p=pct(goal.current,goal.target); const dl=dleft(goal.deadline); const rem=goal.target-goal.current; const isA=active===goal.id; return (
          <div key={goal.id} style={{...T.glass(),padding:20,display:"flex",flexDirection:"column"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:28}}>{goal.emoji}</span><div><p style={{fontSize:14,fontWeight:600,color:T.text.p,margin:"0 0 3px"}}>{goal.name}</p><p style={{fontSize:11,color:dl!==null&&dl<30?C.red:T.text.m,margin:0}}>{dl===null?"No deadline":`${dl} days left`}</p></div></div>
              <span style={{fontSize:13,fontWeight:700,padding:"3px 10px",borderRadius:999,background:p>=75?"rgba(0,200,150,0.12)":T.surfaceL,color:p>=75?C.mint:T.text.s,border:`1px solid ${p>=75?"rgba(0,200,150,0.25)":T.border}`,flexShrink:0}}>{p}%</span>
            </div>
            <Progress value={p}/>
            <div style={{display:"flex",justifyContent:"space-between",margin:"10px 0 16px"}}><span style={{fontSize:12,color:T.text.m}}>{fmt(goal.current)} saved</span><span style={{fontSize:12,color:T.text.m}}>{fmt(rem)} to go</span></div>
            {!isA?<Btn onClick={()=>{setActive(goal.id);setCam("");setCerr("");}} size="sm" fullWidth variant={p>=100?"secondary":"primary"} disabled={p>=100}><Plus size={13}/>{p>=100?"Goal reached! 🎉":"Contribute"}</Btn>:(
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {cerr&&<p style={{fontSize:12,color:C.red,margin:0}}>{cerr}</p>}
                <select value={cfrom} onChange={e=>setCfrom(e.target.value)} style={{width:"100%",background:T.inputBg,border:`1px solid ${T.border}`,borderRadius:8,padding:"8px 12px",color:T.text.p,fontSize:12,fontFamily:"inherit",outline:"none"}}>{accounts.filter(a=>a.balance>0).map(a=><option key={a.id} value={a.id}>{a.nickname} ({fmt(a.balance)})</option>)}</select>
                <div style={{position:"relative"}}><span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:T.text.m,fontSize:13}}>$</span><input type="number" value={cam} onChange={e=>setCam(e.target.value)} min="1" style={{width:"100%",background:T.inputBg,border:`1px solid ${T.border}`,borderRadius:8,padding:"8px 12px 8px 24px",color:T.text.p,fontSize:13,fontFamily:"inherit",outline:"none",boxSizing:"border-box"}} placeholder="Amount"/></div>
                <div style={{display:"flex",gap:6}}><Btn onClick={()=>setActive(null)} variant="ghost" size="sm" style={{flex:1}}>Cancel</Btn><Btn onClick={()=>doC(goal.id)} size="sm" style={{flex:2}}>Add funds</Btn></div>
              </div>
            )}
          </div>
        ); })}
      </div>
    </div>
  );
}

// ─── ANALYTICS PAGE ───────────────────────────────────────────
function AnalyticsPage() {
  const T = useT();
  const totalSpend = CATEGORY_SPEND.reduce((s,c)=>s+c.value,0);
  const totalInflow = MONTHLY.reduce((s,m)=>s+m.inflow,0);
  const totalOutflow = MONTHLY.reduce((s,m)=>s+m.outflow,0);
  const savingsRate = Math.round(((totalInflow-totalOutflow)/totalInflow)*100);
  const avgSpend = Math.round(totalOutflow/MONTHLY.length);
  const bestMonth = MONTHLY.reduce((b,m)=>m.inflow-m.outflow>b.inflow-b.outflow?m:b, MONTHLY[0]);

  return (
    <div style={{display:"flex",flexDirection:"column",gap:22}}>
      <div><h1 style={{fontSize:22,fontWeight:700,color:T.text.p,margin:"0 0 4px",letterSpacing:"-0.01em"}}>Analytics</h1><p style={{fontSize:14,color:T.text.m,margin:0}}>Deep insights into your financial patterns.</p></div>

      <div className="g-stats">
        {[
          {label:"Savings Rate",   value:`${savingsRate}%`,         delta:"↑ +3.2% vs last quarter", col:C.mint},
          {label:"Avg Monthly Spend",value:fmt(avgSpend),           delta:"↓ -5.1% vs last period",  col:C.blue},
          {label:"Best Month",     value:bestMonth.month,           delta:`Net: ${fmt(bestMonth.inflow-bestMonth.outflow)}`, col:C.amber},
        ].map(({label,value,delta,col})=>(
          <div key={label} style={{...T.glass(),padding:"16px 18px"}}>
            <p style={{fontSize:11,fontWeight:500,color:T.text.m,textTransform:"uppercase",letterSpacing:"0.07em",margin:"0 0 8px"}}>{label}</p>
            <p style={{fontSize:20,fontWeight:600,color:T.text.p,margin:"0 0 5px",fontVariantNumeric:"tabular-nums",letterSpacing:"-0.02em"}}>{value}</p>
            <p style={{fontSize:12,color:col,margin:0,fontWeight:500}}>{delta}</p>
          </div>
        ))}
      </div>

      {/* Cash flow chart */}
      <div style={{...T.glass(),padding:"18px 20px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <h3 style={{fontSize:14,fontWeight:600,color:T.text.p,margin:0}}>Income vs Expenses — 6 Month View</h3>
          <div style={{display:"flex",gap:14}}>
            {[{color:C.mint,label:"Income"},{color:C.red,label:"Expenses"}].map(({color,label})=>(
              <div key={label} style={{display:"flex",alignItems:"center",gap:5}}><span style={{width:8,height:8,borderRadius:"50%",background:color,display:"inline-block"}}/><span style={{fontSize:11,color:T.text.m}}>{label}</span></div>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={MONTHLY} margin={{top:4,right:4,left:-28,bottom:0}}>
            <defs>
              <linearGradient id="aIn"  x1="0" y1="0" x2="0" y2="1"><stop offset="5%"  stopColor={C.mint} stopOpacity={0.25}/><stop offset="95%" stopColor={C.mint} stopOpacity={0}/></linearGradient>
              <linearGradient id="aOut" x1="0" y1="0" x2="0" y2="1"><stop offset="5%"  stopColor={C.red}  stopOpacity={0.2}/><stop offset="95%" stopColor={C.red}  stopOpacity={0}/></linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={T.border} vertical={false}/>
            <XAxis dataKey="month" tick={{fill:T.text.m,fontSize:11}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fill:T.text.m,fontSize:11}} axisLine={false} tickLine={false} tickFormatter={v=>`$${(v/1000).toFixed(0)}k`}/>
            <Tooltip contentStyle={{background:T.surfaceSolid,border:`1px solid ${T.borderM}`,borderRadius:8,fontSize:12,color:T.text.p}} formatter={(v,n)=>[fmt(v),n==="inflow"?"Income":"Expenses"]}/>
            <Area type="monotone" dataKey="inflow"  stroke={C.mint} strokeWidth={2.5} fill="url(#aIn)"/>
            <Area type="monotone" dataKey="outflow" stroke={C.red}  strokeWidth={2.5} fill="url(#aOut)"/>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="g-charts">
        {/* Horizontal bar chart */}
        <div style={{...T.glass(),padding:"18px 20px"}}>
          <h3 style={{fontSize:14,fontWeight:600,color:T.text.p,margin:"0 0 16px"}}>Spending by Category</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={CATEGORY_SPEND} layout="vertical" margin={{top:0,right:8,left:0,bottom:0}}>
              <XAxis type="number" tick={{fill:T.text.m,fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`$${v}`}/>
              <YAxis type="category" dataKey="name" tick={{fill:T.text.m,fontSize:11}} axisLine={false} tickLine={false} width={88}/>
              <Tooltip contentStyle={{background:T.surfaceSolid,border:`1px solid ${T.borderM}`,borderRadius:8,fontSize:12,color:T.text.p}} formatter={v=>[fmt(v),"Spent"]}/>
              <Bar dataKey="value" radius={[0,6,6,0]}>
                {CATEGORY_SPEND.map((e,i)=><Cell key={i} fill={e.color}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category breakdown list */}
        <div style={{...T.glass(),padding:"18px 20px"}}>
          <h3 style={{fontSize:14,fontWeight:600,color:T.text.p,margin:"0 0 16px"}}>Category Share</h3>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {CATEGORY_SPEND.slice(0,6).map(cat=>{
              const share=Math.round((cat.value/totalSpend)*100);
              return (
                <div key={cat.name}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <div style={{display:"flex",alignItems:"center",gap:6}}><span style={{width:8,height:8,borderRadius:"50%",background:cat.color,display:"inline-block",flexShrink:0}}/><span style={{fontSize:13,color:T.text.p}}>{cat.name}</span></div>
                    <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:12,color:T.text.m,fontVariantNumeric:"tabular-nums"}}>{fmt(cat.value)}</span><span style={{fontSize:11,color:T.text.m,minWidth:28,textAlign:"right"}}>{share}%</span></div>
                  </div>
                  <div style={{height:4,background:"rgba(128,128,128,0.12)",borderRadius:999,overflow:"hidden"}}><div style={{height:"100%",width:`${share}%`,background:cat.color,borderRadius:999}}/></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SECURITY PAGE ────────────────────────────────────────────
function SecurityPage() {
  const T = useT();
  const [twoFA, setTwoFA] = useState(true);
  const [biometric, setBiometric] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const score = twoFA ? 87 : 61;

  return (
    <div style={{display:"flex",flexDirection:"column",gap:22}}>
      <div><h1 style={{fontSize:22,fontWeight:700,color:T.text.p,margin:"0 0 4px",letterSpacing:"-0.01em"}}>Security</h1><p style={{fontSize:14,color:T.text.m,margin:0}}>Manage your account security settings.</p></div>

      <div className="g-halves">
        {/* Security score */}
        <div style={{...T.glass(),padding:24,display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
          <SecurityRing score={score}/>
          <p style={{fontSize:12,color:T.text.m,margin:0,textAlign:"center",maxWidth:200}}>
            {score>=80?"Your account is well protected. Keep it up!":"Enable 2FA to improve your security score."}
          </p>
        </div>

        {/* Security settings */}
        <div style={{...T.glass(),padding:"20px 24px"}}>
          <h3 style={{fontSize:14,fontWeight:600,color:T.text.p,margin:"0 0 16px"}}>Security Settings</h3>
          {[
            {label:"Two-factor authentication",desc:"Extra layer of account protection",checked:twoFA,set:setTwoFA},
            {label:"Biometric login",desc:"Use Face ID or fingerprint",checked:biometric,set:setBiometric},
            {label:"Login alerts",desc:"Email me on new sign-ins",checked:loginAlerts,set:setLoginAlerts},
          ].map(({label,desc,checked,set})=>(
            <div key={label} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:`1px solid ${T.border}`}}>
              <div>
                <p style={{fontSize:13,fontWeight:500,color:T.text.p,margin:0}}>{label}</p>
                <p style={{fontSize:11,color:T.text.m,margin:"2px 0 0"}}>{desc}</p>
              </div>
              <Toggle checked={checked} onChange={set}/>
            </div>
          ))}
          <div style={{marginTop:16}}>
            <Btn variant="secondary" size="sm" style={{width:"100%"}}>
              <Key size={13}/> Change Password
            </Btn>
          </div>
        </div>
      </div>

      {/* Active sessions */}
      <div style={{...T.glass(),padding:"18px 24px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <h3 style={{fontSize:14,fontWeight:600,color:T.text.p,margin:0}}>Active Sessions</h3>
          <span style={{fontSize:12,color:T.text.m}}>{SESSIONS.length} devices</span>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:0}}>
          {SESSIONS.map((s,i)=>(
            <div key={s.id} style={{display:"flex",alignItems:"center",gap:14,padding:"12px 0",borderBottom:i<SESSIONS.length-1?`1px solid ${T.border}`:"none"}}>
              <div style={{width:40,height:40,borderRadius:10,background:T.surfaceL,border:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <s.Icon size={18} color={s.current?C.mint:T.text.m}/>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <p style={{fontSize:13,fontWeight:500,color:T.text.p,margin:0}}>{s.device}</p>
                  {s.current&&<span style={{fontSize:10,fontWeight:600,padding:"1px 7px",borderRadius:999,background:"rgba(0,200,150,0.12)",color:C.mint}}>Current</span>}
                </div>
                <p style={{fontSize:11,color:T.text.m,margin:"2px 0 0"}}>{s.browser} · {s.location} · {s.lastActive}</p>
              </div>
              {!s.current&&<Btn variant="destructive" size="sm">Revoke</Btn>}
            </div>
          ))}
        </div>
      </div>

      {/* Login history */}
      <div style={{...T.glass(),padding:"18px 24px"}}>
        <h3 style={{fontSize:14,fontWeight:600,color:T.text.p,margin:"0 0 16px"}}>Recent Login Activity</h3>
        <div style={{display:"flex",flexDirection:"column",gap:0}}>
          {LOGIN_HISTORY.map((l,i)=>(
            <div key={l.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:i<LOGIN_HISTORY.length-1?`1px solid ${T.border}`:"none"}}>
              <div style={{width:32,height:32,borderRadius:"50%",background:l.success?"rgba(0,200,150,0.1)":"rgba(255,77,79,0.1)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                {l.success?<Check size={14} color={C.mint}/>:<ShieldAlert size={14} color={C.red}/>}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <p style={{fontSize:13,fontWeight:500,color:l.success?T.text.p:C.red,margin:0}}>{l.action}</p>
                <p style={{fontSize:11,color:T.text.m,margin:"2px 0 0",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{l.device} · {l.location}</p>
              </div>
              <span style={{fontSize:11,color:T.text.m,flexShrink:0}}>{l.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── NOTIFICATIONS PAGE ───────────────────────────────────────
function NotificationsPage() {
  const T = useT();
  const [notifs, setNotifs] = useState(INIT_NOTIFS);
  const [filter, setFilter] = useState("all");

  const markAllRead = () => setNotifs(n=>n.map(x=>({...x,read:true})));
  const markRead = id => setNotifs(n=>n.map(x=>x.id===id?{...x,read:true}:x));
  const unreadCount = notifs.filter(n=>!n.read).length;

  const filters = [{id:"all",label:"All"},{id:"transaction",label:"Transactions"},{id:"goal",label:"Goals"},{id:"security",label:"Security"},{id:"system",label:"System"}];
  const filtered = filter==="all" ? notifs : notifs.filter(n=>n.type===filter);

  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12}}>
        <div>
          <h1 style={{fontSize:22,fontWeight:700,color:T.text.p,margin:"0 0 4px",letterSpacing:"-0.01em"}}>Notifications</h1>
          <p style={{fontSize:14,color:T.text.m,margin:0}}>
            {unreadCount>0?<><span style={{color:C.mint,fontWeight:600}}>{unreadCount} unread</span> — stay up to date</>:"All caught up!"}
          </p>
        </div>
        {unreadCount>0&&<Btn onClick={markAllRead} variant="secondary" size="sm"><CheckCheck size={13}/>Mark all read</Btn>}
      </div>

      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
        {filters.map(f=><Pill key={f.id} active={filter===f.id} onClick={()=>setFilter(f.id)}>{f.label}</Pill>)}
      </div>

      <div style={{...T.glass(),padding:"4px 0",overflow:"hidden"}}>
        {filtered.length===0&&<div style={{textAlign:"center",padding:"40px 0",color:T.text.m,fontSize:14}}>No notifications in this category.</div>}
        {filtered.map((n,i)=>{
          const IconEl = n.icon;
          return (
            <div key={n.id} onClick={()=>markRead(n.id)} style={{display:"flex",alignItems:"flex-start",gap:14,padding:"14px 20px",borderBottom:i<filtered.length-1?`1px solid ${T.border}`:"none",cursor:n.read?"default":"pointer",background:n.read?"transparent":"rgba(0,200,150,0.03)",transition:"background 0.15s"}}>
              <div style={{width:38,height:38,borderRadius:10,background:`${n.color}15`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,border:`1px solid ${n.color}25`}}>
                <IconEl size={16} color={n.color}/>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
                  <p style={{fontSize:13,fontWeight:n.read?500:600,color:T.text.p,margin:0}}>{n.title}</p>
                  <div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0}}>
                    <span style={{fontSize:11,color:T.text.m,whiteSpace:"nowrap"}}>{n.time}</span>
                    {!n.read&&<span style={{width:7,height:7,borderRadius:"50%",background:C.mint,display:"block",flexShrink:0}}/>}
                  </div>
                </div>
                <p style={{fontSize:12,color:T.text.m,margin:"3px 0 0",lineHeight:1.5}}>{n.body}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── SETTINGS PAGE ────────────────────────────────────────────
function SettingsPage({ isDark, onToggleTheme, onLogout }) {
  const T = useT();
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs,  setPushNotifs]  = useState(true);
  const [weeklyReport,setWeeklyReport]= useState(false);
  const [txAlerts,    setTxAlerts]    = useState(true);

  const Section = ({ title, children }) => (
    <div style={{...T.glass(),padding:"18px 24px",display:"flex",flexDirection:"column",gap:0}}>
      <h3 style={{fontSize:13,fontWeight:600,color:T.text.m,textTransform:"uppercase",letterSpacing:"0.07em",margin:"0 0 14px"}}>{title}</h3>
      {children}
    </div>
  );

  const Row = ({ label, desc, right }) => (
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 0",borderBottom:`1px solid ${T.border}`}}>
      <div><p style={{fontSize:13,fontWeight:500,color:T.text.p,margin:0}}>{label}</p>{desc&&<p style={{fontSize:11,color:T.text.m,margin:"2px 0 0"}}>{desc}</p>}</div>
      <div style={{flexShrink:0,marginLeft:16}}>{right}</div>
    </div>
  );

  return (
    <div style={{display:"flex",flexDirection:"column",gap:20,maxWidth:640}}>
      <div><h1 style={{fontSize:22,fontWeight:700,color:T.text.p,margin:"0 0 4px",letterSpacing:"-0.01em"}}>Settings</h1><p style={{fontSize:14,color:T.text.m,margin:0}}>Manage your account preferences.</p></div>

      {/* Profile */}
      <Section title="Profile">
        <div style={{display:"flex",alignItems:"flex-start",gap:14,paddingBottom:16,borderBottom:`1px solid ${T.border}`,marginBottom:4,flexWrap:"wrap"}}>
          <div style={{position:"relative",flexShrink:0}}>
            <div style={{width:60,height:60,borderRadius:"50%",background:`linear-gradient(135deg,${C.mint},${C.blue})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,fontWeight:700,color:"white"}}>AC</div>
            <div style={{position:"absolute",bottom:0,right:0,width:20,height:20,borderRadius:"50%",background:T.surfaceL,border:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><Camera size={10} color={T.text.m}/></div>
          </div>
          <div style={{flex:1,minWidth:0}}>
            <p style={{fontSize:16,fontWeight:600,color:T.text.p,margin:"0 0 2px"}}>Alex Chen</p>
            <p style={{fontSize:13,color:T.text.m,margin:"0 0 10px"}}>alex@finvault.io</p>
            <Btn variant="secondary" size="sm">Edit Profile</Btn>
          </div>
        </div>
        <Row label="Full name" right={<span style={{fontSize:13,color:T.text.m}}>Alex Chen</span>}/>
        <Row label="Email address" right={<span style={{fontSize:13,color:T.text.m}}>alex@finvault.io</span>}/>
        <Row label="Phone number" right={<span style={{fontSize:13,color:T.text.m}}>+1 (415) 555-0192</span>}/>
      </Section>

      {/* Appearance */}
      <Section title="Appearance">
        <Row label="Dark mode" desc="Switch between dark and light themes"
          right={<Toggle checked={isDark} onChange={onToggleTheme}/>}/>
        <Row label="Currency" desc="Display currency for all balances"
          right={<span style={{fontSize:13,color:T.text.m}}>USD ($)</span>}/>
        <Row label="Language" right={<span style={{fontSize:13,color:T.text.m}}>English (US)</span>}/>
      </Section>

      {/* Notification preferences */}
      <Section title="Notifications">
        <Row label="Email notifications"   desc="Account updates and alerts"         right={<Toggle checked={emailNotifs}   onChange={setEmailNotifs}/>}/>
        <Row label="Push notifications"    desc="Real-time alerts on your device"    right={<Toggle checked={pushNotifs}    onChange={setPushNotifs}/>}/>
        <Row label="Transaction alerts"    desc="Notify on every transaction"        right={<Toggle checked={txAlerts}      onChange={setTxAlerts}/>}/>
        <Row label="Weekly spending report" desc="Summary every Monday morning"      right={<Toggle checked={weeklyReport}  onChange={setWeeklyReport}/>}/>
      </Section>

      {/* Account */}
      <Section title="Account & Data">
        <Row label="Export account data"   desc="Download all your transactions as CSV"
          right={<Btn variant="secondary" size="sm"><Download size={13}/>Export</Btn>}/>
        <Row label="Security settings"     desc="2FA, sessions, login history"
          right={<Btn variant="secondary" size="sm"><Shield size={13}/>Manage</Btn>}/>
        <Row label="Sign out of all devices" desc="Revoke all active sessions"
          right={<Btn variant="secondary" size="sm" onClick={onLogout}><LogOut size={13}/>Sign out</Btn>}/>
        <div style={{paddingTop:12}}>
          <div style={{background:"rgba(255,77,79,0.06)",border:"1px solid rgba(255,77,79,0.2)",borderRadius:10,padding:"14px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div><p style={{fontSize:13,fontWeight:500,color:C.red,margin:0}}>Delete account</p><p style={{fontSize:11,color:T.text.m,margin:"2px 0 0"}}>Permanently remove your account and all data</p></div>
            <Btn variant="destructive" size="sm"><Trash2 size={13}/>Delete</Btn>
          </div>
        </div>
      </Section>
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────
export default function App() {
  const [isDark,     setIsDark]     = useState(true);
  const [authPage,   setAuthPage]   = useState("login");
  const [user,       setUser]       = useState(null);
  const [page,       setPage]       = useState("overview");
  const [accounts,   setAccounts]   = useState(INIT_ACCOUNTS);
  const [goals,      setGoals]      = useState(INIT_GOALS);
  const [toast,      setToast]      = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const T = isDark ? DARK : LIGHT;
  const toggleTheme   = useCallback(()=>setIsDark(d=>!d),[]);
  const showToast     = useCallback(msg=>setToast(msg),[]);
  const handleLogin   = useCallback(u=>{ setUser(u); setPage("overview"); },[]);
  const handleLogout  = useCallback(()=>{ setUser(null); setAuthPage("login"); setAccounts(INIT_ACCOUNTS); setGoals(INIT_GOALS); setDrawerOpen(false); },[]);
  const handleTransfer = useCallback(({fromId,toId,amount})=>{
    setAccounts(p=>p.map(a=>a.id===fromId?{...a,balance:a.balance-amount}:a.id===toId?{...a,balance:a.balance+amount}:a));
    showToast(`${fmt(amount)} transferred successfully!`);
  },[showToast]);
  const handleContribute = useCallback((goalId,fromAccId,amount)=>{
    setAccounts(p=>p.map(a=>a.id===fromAccId?{...a,balance:a.balance-amount}:a));
    setGoals(p=>p.map(g=>g.id===goalId?{...g,current:Math.min(g.target,g.current+amount)}:g));
    showToast(`Added ${fmt(amount)} to your goal!`);
  },[showToast]);

  if(!user) {
    return (
      <ThemeCtx.Provider value={T}>
        <style>{CSS}</style>
        {authPage==="login"
          ? <LoginPage onLogin={handleLogin} onGoRegister={()=>setAuthPage("register")} isDark={isDark} onToggle={toggleTheme}/>
          : <RegisterPage onGoLogin={()=>setAuthPage("login")} isDark={isDark} onToggle={toggleTheme}/>
        }
      </ThemeCtx.Provider>
    );
  }

  return (
    <ThemeCtx.Provider value={T}>
      <style>{CSS}</style>
      <div className={`fv-app ${isDark?"":"light"}`} style={{background:T.bg}}>

        <div className="fv-desk-sb" style={{background:T.sidebarBg,borderRight:`1px solid ${T.border}`,backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)"}}>
          <SidebarContent page={page} setPage={setPage} user={user} onLogout={handleLogout} isDark={isDark} onToggle={toggleTheme}/>
        </div>

        <div className="fv-main-col">
          {/* Desktop sticky header — hidden on mobile/tablet via CSS */}
          <DesktopHeader page={page} user={user} isDark={isDark} onToggle={toggleTheme} onLogout={handleLogout}/>
          {/* Mobile/tablet header — hidden on desktop via CSS */}
          <div className="fv-mob-hdr" style={{background:T.headerBg,borderBottomColor:T.border}}>
            <MobileHeader onOpen={()=>setDrawerOpen(true)} isDark={isDark} onToggle={toggleTheme}/>
          </div>
          <main className="fv-scroll" style={{background:T.bg}}>
            {page==="overview"      && <OverviewPage      accounts={accounts} transactions={TRANSACTIONS} setPage={setPage} showToast={showToast}/>}
            {page==="transactions"  && <TransactionsPage  transactions={TRANSACTIONS}/>}
            {page==="transfers"     && <TransfersPage     accounts={accounts} onTransfer={handleTransfer}/>}
            {page==="goals"         && <GoalsPage         goals={goals} accounts={accounts} onContribute={handleContribute}/>}
            {page==="analytics"     && <AnalyticsPage/>}
            {page==="security"      && <SecurityPage/>}
            {page==="notifications" && <NotificationsPage/>}
            {page==="settings"      && <SettingsPage isDark={isDark} onToggleTheme={toggleTheme} onLogout={handleLogout}/>}
          </main>
        </div>

        <div className="fv-bnav" style={{background:T.bnavBg,borderTopColor:T.border}}>
          <BottomNav page={page} setPage={setPage}/>
        </div>

        <DrawerSidebar isOpen={drawerOpen} onClose={()=>setDrawerOpen(false)} page={page} setPage={setPage} user={user} onLogout={handleLogout} isDark={isDark} onToggle={toggleTheme}/>
        {toast&&<Toast message={toast} onClose={()=>setToast(null)}/>}
      </div>
    </ThemeCtx.Provider>
  );
}
