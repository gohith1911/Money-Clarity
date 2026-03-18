import { useState, useEffect } from "react";
import { C, FONTS } from "./theme/constants";
import { AffordabilityChecker } from "./features/Affordability/AffordabilityChecker";
import { IncomeGoalCalc } from "./features/IncomeGoal/IncomeGoalCalc";

export default function App() {
  const [tab, setTab] = useState("goal");
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (installPrompt) {
      installPrompt.prompt();
      installPrompt.userChoice.then(() => {
        setInstallPrompt(null);
      });
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", alignItems: "center", padding: "36px 16px 80px", fontFamily: "'Outfit', sans-serif" }}>
      <style>{FONTS}</style>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
      <div style={{ maxWidth: 520, width: "100%", marginBottom: 32 }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.accent, letterSpacing: "0.18em", marginBottom: 10 }}>◆ PERSONAL FINANCE TOOLS</div>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 36, color: C.ink, lineHeight: 1.1, marginBottom: 8 }}>
          Money<br /><em style={{ color: C.accentMid }}>Clarity.</em>
        </h1>
        <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: C.muted, lineHeight: 1.7 }}>
        Master your money. Plan your next move.
        </p>
      </div>
      {installPrompt && (
        <div style={{ maxWidth: 520, width: "100%", marginBottom: 24 }}>
            <button onClick={handleInstallClick} style={{ width: '100%', padding: "16px 18px", borderRadius: 14, textAlign: "center", border: `2px solid ${C.accent}`, background: C.accent, cursor: "pointer", transition: "all .2s" }}>
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 15, color: C.paper, marginBottom: 3 }}>Install App</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.5)"}}>For a better experience</div>
            </button>
        </div>
      )}
      <div style={{ maxWidth: 520, width: "100%", marginBottom: 24 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { v: "goal",  title: "Lifestyle Target", sub: "Build your dream life.", icon: "↑" },
            { v: "check", title: "Affordability Check", sub: "Buy with confidence.", icon: "⚖" },
          ].map(t => (
            <button key={t.v} onClick={() => setTab(t.v)} style={{ padding: "16px 18px", borderRadius: 14, textAlign: "left", border: `2px solid ${tab === t.v ? C.ink : C.border}`, background: tab === t.v ? C.ink : C.paper, cursor: "pointer", transition: "all .2s" }}>
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 15, color: tab === t.v ? C.paper : C.ink, marginBottom: 3 }}>{t.icon} {t.title}</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: tab === t.v ? "rgba(255,255,255,0.5)" : C.muted }}>{t.sub}</div>
            </button>
          ))}
        </div>
      </div>
      <div style={{ maxWidth: 520, width: "100%", background: C.paper, border: `1px solid ${C.border}`, borderRadius: 18, padding: 28, boxShadow: "0 4px 24px rgba(0,0,0,0.05)" }}>
        {tab === "check" ? <AffordabilityChecker key="check" /> : <IncomeGoalCalc key="goal" />}
      </div>
      <div style={{ marginTop: 24, fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.muted, textAlign: "center", lineHeight: 1.8, maxWidth: 400 }}>
        Numbers are for guidance only, not financial advice.<br />All calculations in INR (₹).
      </div>
    </div>
  );
}
