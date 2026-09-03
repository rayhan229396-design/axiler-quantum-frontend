import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowLeft, ArrowRight, Camera, ChevronRight, CircleHelp, Clock3,
  Image as ImageIcon, RefreshCw, Send, ShieldCheck, Star, UserRound,
  Zap, TrendingDown, TrendingUp, Upload, X, CheckCircle2
} from "lucide-react";
import "./styles.css";

const ASSETS = [
  "EUR/USD OTC","GBP/USD OTC","USD/JPY OTC","GBP/JPY OTC","AUD/CAD OTC","EUR/JPY OTC",
  "USD/CHF OTC","NZD/USD OTC","AUD/USD OTC","USD/CAD OTC","AUD/CHF OTC","AUD/JPY OTC",
  "CAD/JPY OTC","CHF/JPY OTC","EUR/CHF OTC","EUR/AUD OTC","EUR/CAD OTC","GBP/AUD OTC",
  "GBP/CAD OTC","GBP/NZD OTC","NZD/CAD OTC","NZD/JPY OTC","AUD/NZD OTC","USD/BRL OTC",
  "USD/PKR OTC","USD/TRY OTC","USD/ZAR OTC"
];

const TIMEFRAMES = [
  { label:"5 Seconds", value:5 }, { label:"10 Seconds", value:10 }, { label:"15 Seconds", value:15 },
  { label:"30 Seconds", value:30 }, { label:"1 Minute", value:1 }, { label:"2 Minutes", value:2 },
  { label:"3 Minutes", value:3 }, { label:"5 Minutes", value:5 }
];

const SETUPS = [
  { pair:"EUR/AUD OTC", direction:"PUT", confidence:"95.2%" },
  { pair:"USD/CAD OTC", direction:"CALL", confidence:"98.4%" },
  { pair:"AUD/CHF OTC", direction:"PUT", confidence:"91.5%" }
];

function App() {
  const [screen, setScreen] = useState("home");
  const [asset, setAsset] = useState(null);
  const [timeframe, setTimeframe] = useState(null);
  const [signal, setSignal] = useState(null);
  const [image, setImage] = useState(null);
  const [notice, setNotice] = useState("");
  const fileRef = useRef();

  const go = (s) => { setNotice(""); setScreen(s); window.scrollTo({top:0,behavior:"smooth"}); };

  const makeSignal = (pair, tf) => {
    const bullish = ["USD/CAD OTC","AUD/JPY OTC","USD/BDT OTC","EUR/USD OTC"].includes(pair)
      ? true : pair === "AUD/CHF OTC" ? false : Math.random() > .45;
    setSignal({
      pair,
      timeframe: tf,
      side: bullish ? "BUY (LONG)" : "SELL (SHORT)",
      direction: bullish ? "UPWARD" : "DOWNWARD",
      confidence: ["95.8%","96.8%","97.0%","89.6%"][Math.floor(Math.random()*4)],
      strength: Math.random() > .25 ? 5 : 4,
      duration: tf
    });
    go("signal");
  };

  const chooseAsset = (a) => { setAsset(a); go("timeframe"); };
  const chooseTimeframe = (tf) => { setTimeframe(tf); makeSignal(asset || "EUR/USD OTC", tf.value); };

  const handlePhoto = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!["image/jpeg","image/png","image/webp"].includes(f.type)) {
      setNotice("Please select a JPG, PNG or WEBP image.");
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setNotice("Image must be 5 MB or smaller.");
      return;
    }
    setImage({ name:f.name, url:URL.createObjectURL(f) });
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">AQ</div>
          <div><b>AXILER <span>QUANTUM</span></b><small>V2.1</small></div>
        </div>
        <div className="live"><i/> LIVE AI <span>•</span> <b>617</b></div>
      </header>

      <main className="page">
        {notice && <div className="notice">{notice}</div>}

        {screen === "home" && (
          <Home
            onPhoto={() => go("photo")}
            onManual={() => go("assets")}
            onSetup={(s) => makeSignal(s.pair, 1)}
          />
        )}

        {screen === "photo" && (
          <PhotoAnalysis
            image={image}
            fileRef={fileRef}
            onUpload={handlePhoto}
            onRemove={() => setImage(null)}
            onBack={() => go("home")}
            onAnalyze={() => {
              if (!image) { setNotice("Upload a chart screenshot first."); return; }
              setSignal({
                pair:"EUR/USD OTC", timeframe:1, side:"BUY (LONG)", direction:"UPWARD",
                confidence:"97.8%", strength:5, duration:1
              });
              go("photo-result");
            }}
          />
        )}

        {screen === "photo-result" && (
          <PhotoResult image={image} onBack={() => go("photo")} onSignal={() => go("signal")} />
        )}

        {screen === "assets" && (
          <AssetPicker selected={asset} onBack={() => go("home")} onSelect={chooseAsset} />
        )}

        {screen === "timeframe" && (
          <TimeframePicker asset={asset} onBack={() => go("assets")} onSelect={chooseTimeframe} />
        )}

        {screen === "signal" && (
          <SignalScreen signal={signal} onBack={() => go("home")} onNew={() => go("assets")} />
        )}

        {screen === "reviews" && <Reviews />}
        {screen === "profile" && <Profile />}
      </main>

      <BottomNav screen={screen} go={go} />
      <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
        hidden onChange={handlePhoto} />
    </div>
  );
}

function Header({back, children}) {
  return <div className="screen-head">
    <button className="back" onClick={back}><ArrowLeft size={18}/> Back</button>
    {children}
  </div>
}

function Home({onPhoto,onManual,onSetup}) {
  return <>
    <div className="broker"><div className="broker-logo">Q</div><div><b>Quotex <span>Broker</span></b><small>SIGNALS OPTIMIZED ONLY</small></div></div>
    <section className="hero"><h1>WELCOME, <span>ELITE TRADER</span></h1><p>Choose how the Quantum engine finds your next signal</p></section>

    <ActionCard icon={<Camera/>} accent="red" title="Photo Analysis" badge="NEW"
      text="Upload a chart screenshot — AI reads the pair & gives a signal" onClick={onPhoto}/>
    <ActionCard icon={<Zap/>} accent="green" title="Manual Analysis"
      text="Pick pair & timeframe yourself — classic AI signal flow" onClick={onManual}/>

    <SectionTitle icon={<TrendingDown/>} title="TODAY'S BEST SETUPS" action="REFRESH"/>
    <div className="setups">
      {SETUPS.map((s,i)=><SetupCard key={i} setup={s} onClick={()=>onSetup(s)}/>)}
    </div>

    <div className="stat-card"><Zap size={17}/><span>Signals generated today</span><strong>6,303</strong></div>
    <div className="admin-card"><Send size={17}/><div><b>Contact Admin <em>TG</em></b><small>@Elite_Axiler — Help & support</small></div><CircleHelp size={18}/></div>
  </>;
}

function ActionCard({icon,accent,title,badge,text,onClick}) {
  return <button className={`action-card ${accent}`} onClick={onClick}>
    <div className="icon-box">{icon}</div><div className="action-copy"><b>{title}</b>{badge&&<em>{badge}</em>}<small>{text}</small></div><ChevronRight/>
  </button>
}
function SectionTitle({icon,title,action}) {
  return <div className="section-title">{icon}<b>{title}</b><span>{action} ↻</span></div>
}
function SetupCard({setup,onClick}) {
  const up=setup.direction==="CALL";
  return <button className={`setup ${up?"up":"down"}`} onClick={onClick}>
    {up?<TrendingUp/>:<TrendingDown/>}<div><b>{setup.pair}</b><small>{setup.direction} signal</small><small>Entry at next candle · 21:15:00</small></div><strong>{setup.confidence}<small>CONFIDENCE</small></strong>
  </button>
}

function PhotoAnalysis({image,fileRef,onUpload,onRemove,onBack,onAnalyze}) {
  return <>
    <Header back={onBack}/>
    <div className="broker compact"><div className="broker-logo">Q</div><div><b>Quotex <span>Broker</span></b><small>SIGNALS OPTIMIZED ONLY</small></div></div>
    <h2>PHOTO ANALYSIS</h2><p className="muted">Upload a chart screenshot — AI reads the pair & gives a signal.</p>
    <div className="photo-time-card"><div className="photo-time-grid">{TIMEFRAMES.map((t,i)=><button className={t.value===1&&i===4?"active":""} key={i}>{t.label}</button>)}</div><small>Optional — the timeframe is auto-detected from the screenshot when visible.</small></div>
    <div className={`upload-zone ${image?"has-image":""}`}>
      {image ? <><img src={image.url}/><div className="file-row"><span>{image.name}</span><button onClick={onRemove}><X size={15}/> Remove</button></div></>
      : <><ImageIcon size={42}/><b>Screenshot uploaded</b><small>or drag & drop a screenshot here</small></>}
      <div className="upload-actions">
        <button className="primary" onClick={()=>fileRef.current?.click()}><Upload size={17}/> {image?"CHANGE IMAGE":"UPLOAD IMAGE"}</button>
        <button className="secondary" onClick={()=>fileRef.current?.click()}><Camera size={17}/> CAMERA</button>
      </div>
      <small>JPG · PNG · WEBP → up to 5 MB</small>
    </div>
    <div className="privacy"><ShieldCheck size={16}/> Processed in memory · nothing stored <span>Privacy</span></div>
    <button className="wide-primary" onClick={onAnalyze}>ANALYZE CHART <ArrowRight/></button>
  </>;
}

function PhotoResult({image,onBack,onSignal}) {
  return <>
    <Header back={onBack}/>
    <h2>AI RESULT</h2>
    <div className="detected"><small>DETECTED FROM SCREENSHOT</small><div><b>EUR/USD OTC</b><b>1 Minute</b><b>Bullish</b></div><p>Price exhibits an overall upward trajectory with higher lows, recently consolidating near resistance.</p></div>
    <div className="result-card up"><TrendingUp/><div><b>EUR/USD OTC</b><strong>CALL signal</strong><small>Entry at next candle · 21:15:00</small></div><em>97.8%</em></div>
    <div className="read-card"><b>WHAT AI READS FROM YOUR CHART</b><p>● Currency pair (e.g. EUR/USD OTC)</p><p>● Current price level</p><p>● Trend direction</p><p>● Support / resistance structure</p></div>
    <button className="wide-primary" onClick={onSignal}>VIEW SIGNAL <ArrowRight/></button>
  </>;
}

function AssetPicker({selected,onBack,onSelect}) {
  return <>
    <Header back={onBack}/>
    <div className="broker compact"><div className="broker-logo">Q</div><div><b>Quotex <span>Broker</span></b><small>SIGNALS OPTIMIZED ONLY</small></div></div>
    <h2>OTC PAIRS</h2><div className="asset-panel"><small>SELECT ASSET</small><div className="asset-grid">{ASSETS.map(a=><button key={a} className={selected===a?"selected":""} onClick={()=>onSelect(a)}>{a}</button>)}</div></div>
  </>;
}

function TimeframePicker({asset,onBack,onSelect}) {
  return <>
    <Header back={onBack}/>
    <div className="broker compact"><div className="broker-logo">Q</div><div><b>Quotex <span>Broker</span></b><small>SIGNALS OPTIMIZED ONLY</small></div></div>
    <h2>SELECT TIMEFRAME</h2>
    <div className="asset-panel"><small>SELECT TIMEFRAME</small><div className="tf-list">{TIMEFRAMES.map((t,i)=><button key={i} onClick={()=>onSelect(t)} className={i===4?"active": ""}>{t.label}</button>)}</div><small className="tf-note">Select your preferred trade duration.</small></div>
  </>;
}

function SignalScreen({signal,onBack,onNew}) {
  const [seconds,setSeconds]=useState(0);
  useEffect(()=>{ const id=setInterval(()=>setSeconds(s=>s+1),1000); return()=>clearInterval(id)},[]);
  const remaining = 60-(seconds%60);
  if(!signal) return null;
  const up=signal.side.includes("BUY");
  const mins=signal.duration;
  const end = String(mins).padStart(2,"0")+":00";
  return <>
    <Header back={onBack}/>
    <div className="signal-head"><b>Signal for: <span>{signal.pair}</span></b><small>Timeframe: {signal.timeframe} Minute</small></div>
    <div className={`signal-icon ${up?"green":"red"}`}>{up?<TrendingUp size={72}/>:<TrendingDown size={72}/>}</div>
    <div className={`direction ${up?"green-text":"red-text"}`}>{signal.direction}</div>
    <h1 className={`signal-title ${up?"green-text":"red-text"}`}>{signal.side}</h1>
    <div className="signal-stats"><div><small>SIGNAL STRENGTH</small><div className="dots">{[1,2,3,4,5].map(i=><i className={i<=signal.strength?"on":""} key={i}/>)}</div><b>{signal.strength}/5</b></div><div><small>WIN RATE</small><strong>{signal.confidence}</strong><small>Live</small></div></div>
    <div className="entry-card"><small>ENTRY INSTRUCTION</small><h3 className={up?"green-text":"red-text"}>{remaining<=3?"PLACE TRADE IN "+remaining+"S":"● ENTER NOW — CANDLE OPEN"}</h3><p>Wait for the running candle to close. Enter at the next candle open — <b>21:54:00</b>, expiry <b>21:55:00</b> (1 Minute).</p><div className="timers"><span>ENTRY IN <b>{remaining}s</b></span><span>TRADE ENDS IN <b>{Math.max(0,mins*60-(seconds%60))}s</b></span></div></div>
    <button className="wide-primary" onClick={onNew}><RefreshCw/> NEW SIGNAL</button>
  </>;
}

function Reviews() {
  return <><h2>REVIEWS</h2><p className="muted">Trader feedback and recent experiences.</p>{[
    ["A.","Very clean interface and easy signal flow.","5.0"],
    ["M.","The manual analysis screen is simple to use.","4.8"],
    ["R.","Fast navigation and clear entry instructions.","4.9"]
  ].map((r,i)=><div className="review" key={i}><div className="avatar">{r[0]}</div><div><b>{r[0]} Trader</b><small>{r[1]}</small><span>{"★".repeat(5)} {r[2]}</span></div></div>)}</>;
}
function Profile() {
  return <><h2>PROFILE</h2><div className="profile-card"><div className="big-avatar"><UserRound/></div><h3>ELITE TRADER</h3><p className="muted">Quantum member</p></div><div className="profile-row"><ShieldCheck/> <span>Account status</span><b>Active</b></div><div className="profile-row"><Star/> <span>Plan</span><b>Quantum V2.1</b></div><div className="profile-row"><CircleHelp/> <span>Support</span><b>@Elite_Axiler</b></div></>;
}
function BottomNav({screen,go}) {
  return <nav className="bottom-nav">
    <button className={["home","assets","timeframe","photo","photo-result","signal"].includes(screen)?"active":""} onClick={()=>go("home")}><Zap/><span>TRADE</span></button>
    <button className={screen==="reviews"?"active":""} onClick={()=>go("reviews")}><Star/><span>REVIEWS</span></button>
    <button className={screen==="profile"?"active":""} onClick={()=>go("profile")}><UserRound/><span>PROFILE</span></button>
  </nav>
}

createRoot(document.getElementById("root")).render(<App/>);
