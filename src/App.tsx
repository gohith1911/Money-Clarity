import { useState } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@300;400;500&family=Outfit:wght@300;400;500;600;700&display=swap');`;

const C = {
  bg: "#F5F2EB", paper: "#FDFCF8", ink: "#1A1A14", muted: "#8A8778",
  border: "#E2DDD4", accent: "#1C5C3A", accentLight: "#EBF4EF", accentMid: "#2E7D52",
  amber: "#D4860A", amberLight: "#FDF3E0", red: "#C0392B", redLight: "#FDECEA",
  blue: "#1A3A6C", blueLight: "#EBF0FA",
};

const VERDICTS = [
  { key: "great",  label: "GREAT",  icon: "◆", color: C.accent,   bg: C.accentLight, ratio: [0, 0.5]        },
  { key: "good",   label: "GOOD",   icon: "●", color: "#2E7D52",   bg: "#EEF7F2",     ratio: [0.5, 0.75]    },
  { key: "fine",   label: "FINE",   icon: "◐", color: C.amber,     bg: C.amberLight,  ratio: [0.75, 1.0]    },
  { key: "bad",    label: "BAD",    icon: "▲", color: "#B8600A",   bg: "#FDF0E0",     ratio: [1.0, 1.5]     },
  { key: "worst",  label: "WORST",  icon: "■", color: C.red,       bg: C.redLight,    ratio: [1.5, Infinity] },
];
const getVerdict = (r) => VERDICTS.find((v) => r >= v.ratio[0] && r < v.ratio[1]);

const TIERS = [
  { key: "min",   label: "Minimum",     pct: 40, desc: "Tight but possible. You can manage it.",      color: C.red    },
  { key: "comfy", label: "Comfortable", pct: 25, desc: "Healthy balance. Room for savings too.",      color: C.amber  },
  { key: "free",  label: "Freedom",     pct: 15, desc: "You barely feel it. Fully comfortable zone.", color: C.accent },
];

const n = (v) => parseFloat(String(v).replace(/,/g, "")) || 0;
const fmt = (v) => Math.round(v).toLocaleString("en-IN");
const fmtD = (v) => parseFloat(v).toLocaleString("en-IN", { maximumFractionDigits: 1 });

// Format raw input string to Indian comma style as user types
function fmtInput(raw) {
  const digits = String(raw).replace(/,/g, "").replace(/[^0-9]/g, "");
  if (!digits) return "";
  return parseInt(digits, 10).toLocaleString("en-IN");
}

function Label({ children }) {
  return (
    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, fontWeight: 500, color: C.muted, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 7 }}>
      {children}
    </div>
  );
}

function Field({ label, value, onChange, prefix = "₹", suffix, placeholder = "0", hint }) {
  const [focus, setFocus] = useState(false);
  const handleChange = (e) => {
    const raw = e.target.value.replace(/,/g, "").replace(/[^0-9]/g, "");
    onChange(raw); // store raw digits
  };
  const displayValue = value ? fmtInput(value) : "";
  return (
    <div style={{ marginBottom: 18 }}>
      <Label>{label}</Label>
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        {prefix && <span style={{ position: "absolute", left: 13, fontFamily: "'DM Mono', monospace", fontSize: 13, color: focus ? C.accent : C.muted, pointerEvents: "none", transition: "color .2s" }}>{prefix}</span>}
        <input
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={handleChange}
          placeholder={placeholder}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={{ width: "100%", boxSizing: "border-box", background: C.paper, border: `1.5px solid ${focus ? C.accent : C.border}`, borderRadius: 10, padding: `12px 14px 12px ${prefix ? "30px" : "14px"}`, fontFamily: "'DM Mono', monospace", fontSize: 15, color: C.ink, outline: "none", transition: "border-color .2s" }}
        />
        {suffix && <span style={{ position: "absolute", right: 13, fontFamily: "'DM Mono', monospace", fontSize: 11, color: C.muted }}>{suffix}</span>}
      </div>
      {hint && <div style={{ marginTop: 5, fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.muted }}>{hint}</div>}
    </div>
  );
}

function Pill({ label, value, color, sub }) {
  return (
    <div style={{ background: C.paper, border: `1px solid ${C.border}`, borderRadius: 10, padding: "13px 15px", flex: 1 }}>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 5 }}>{label}</div>
      <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 17, fontWeight: 700, color: color || C.ink }}>{value}</div>
      {sub && <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.muted, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function Seg({ options, value, onChange }) {
  return (
    <div style={{ display: "flex", background: C.bg, borderRadius: 10, padding: 4, gap: 3 }}>
      {options.map((o) => (
        <button key={o.v} onClick={() => onChange(o.v)} style={{ flex: 1, padding: "9px 6px", borderRadius: 7, border: "none", background: value === o.v ? C.paper : "transparent", boxShadow: value === o.v ? "0 1px 4px rgba(0,0,0,0.08)" : "none", fontFamily: "'DM Mono', monospace", fontSize: 11, color: value === o.v ? C.ink : C.muted, fontWeight: value === o.v ? 500 : 400, cursor: "pointer", transition: "all .2s" }}>{o.l}</button>
      ))}
    </div>
  );
}

function Btn({ children, onClick, disabled, variant = "primary" }) {
  const styles = {
    primary: { bg: C.ink, color: C.paper, border: "none" },
    outline:  { bg: "transparent", color: C.muted, border: `1.5px solid ${C.border}` },
    ghost:    { bg: C.accentLight, color: C.accent, border: "none" },
  };
  const s = styles[variant];
  return (
    <button onClick={onClick} disabled={disabled} style={{ padding: "13px 20px", borderRadius: 11, border: s.border, background: disabled ? C.border : s.bg, color: disabled ? C.muted : s.color, fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer", transition: "all .2s", width: "100%" }}>
      {children}
    </button>
  );
}

function AffordabilityChecker() {
  const [phase, setPhase] = useState(1);
  const [income, setIncome] = useState("");
  const [spend,  setSpend]  = useState("");
  const [item,   setItem]   = useState("");
  const [price,  setPrice]  = useState("");
  const [payT,   setPayT]   = useState("emi");
  const [emiM,   setEmiM]   = useState(6);
  const [intR,   setIntR]   = useState("0");
  const [result, setResult] = useState(null);

  const dailyInc  = n(income) / 365;
  const dailySurp = (n(income) - n(spend)) / 365;
  const savPct    = n(income) > 0 ? (((n(income) - n(spend)) / n(income)) * 100).toFixed(1) : 0;
  const canP2     = n(income) > 0 && n(spend) > 0 && n(income) > n(spend);
  const canCalc   = item.trim() && n(price) > 0;

  function calc() {
    const ir = n(intR);
    let totalCost = n(price);
    if (payT === "emi" && ir > 0) totalCost = n(price) * (1 + (ir / 100) * (emiM / 12));
    const daysRec = totalCost / dailySurp;
    const emiDays = payT === "emi" ? emiM * 30 : 30;
    const ratio   = daysRec / emiDays;
    setResult({ totalCost, daysRec, monthsRec: daysRec / 30, ratio, verdict: getVerdict(ratio) });
    setPhase(3);
  }

  const EMI_OPTS = [3, 6, 9, 12, 18, 24];

  return (
    <div style={{ animation: "fadeUp .35s ease" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 24 }}>
        {[1, 2, 3].map((s, i) => (
          <div key={s} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 26, height: 26, borderRadius: "50%", background: phase > s ? C.accent : phase === s ? C.ink : C.bg, border: `1.5px solid ${phase >= s ? (phase > s ? C.accent : C.ink) : C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Mono', monospace", fontSize: 10, fontWeight: 600, color: phase >= s ? C.paper : C.muted, transition: "all .3s" }}>{phase > s ? "✓" : s}</div>
            {i < 2 && <div style={{ width: 20, height: 1.5, background: phase > s ? C.accent : C.border, transition: "background .3s" }} />}
          </div>
        ))}
        <span style={{ marginLeft: 8, fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.muted }}>
          {phase === 1 ? "Your finances" : phase === 2 ? "What to buy" : "Verdict"}
        </span>
      </div>

      {phase === 1 && (
        <div>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: C.ink, marginBottom: 4 }}>Your Financial Snapshot</div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: C.muted }}>Enter your yearly numbers. We'll figure out your daily buying power.</div>
          </div>
          <Field label="Yearly Income" value={income} onChange={setIncome} hint="All income sources combined" />
          <Field label="Yearly Total Expenses" value={spend} onChange={setSpend} hint="Rent, food, bills, existing EMIs, everything" />
          {canP2 && (
            <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
              <Pill label="Daily Income" value={`₹${fmt(dailyInc)}`} color={C.blue} />
              <Pill label="Daily Surplus" value={`₹${fmt(dailySurp)}`} color={C.accent} />
              <Pill label="Saved" value={`${savPct}%`} color={savPct >= 30 ? C.accent : savPct >= 15 ? C.amber : C.red} />
            </div>
          )}
          {n(income) > 0 && n(spend) >= n(income) && (
            <div style={{ background: C.redLight, border: `1px solid ${C.red}30`, borderRadius: 8, padding: "10px 14px", fontFamily: "'DM Mono', monospace", fontSize: 11, color: C.red, marginBottom: 16 }}>
              ⚠ Spending exceeds income. Review your numbers.
            </div>
          )}
          <Btn onClick={() => setPhase(2)} disabled={!canP2}>Continue →</Btn>
        </div>
      )}

      {phase === 2 && (
        <div>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: C.ink, marginBottom: 4 }}>What Do You Want to Buy?</div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: C.muted }}>Works for one-time purchases, subscriptions, or recurring spends.</div>
          </div>
          <div style={{ marginBottom: 18 }}>
            <Label>Item or Expense Name</Label>
            <input type="text" value={item} onChange={e => setItem(e.target.value)} placeholder="e.g. iPhone 16 Pro, Netflix, Gym membership"
              style={{ width: "100%", boxSizing: "border-box", background: C.paper, border: `1.5px solid ${C.border}`, borderRadius: 10, padding: "12px 14px", fontFamily: "'DM Mono', monospace", fontSize: 13, color: C.ink, outline: "none" }}
              onFocus={e => e.target.style.borderColor = C.accent} onBlur={e => e.target.style.borderColor = C.border}
            />
          </div>
          <Field label="Total Price / Amount" value={price} onChange={setPrice} />
          <div style={{ marginBottom: 18 }}>
            <Label>Payment Type</Label>
            <Seg value={payT} onChange={setPayT} options={[{v:"full",l:"Full"},{v:"emi",l:"EMI"},{v:"monthly",l:"Monthly"},{v:"yearly",l:"Yearly"}]} />
          </div>
          {payT === "emi" && (
            <>
              <div style={{ marginBottom: 18 }}>
                <Label>EMI Duration</Label>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {EMI_OPTS.map(m => (
                    <button key={m} onClick={() => setEmiM(m)} style={{ padding: "9px 14px", borderRadius: 8, fontFamily: "'DM Mono', monospace", fontSize: 12, border: `1.5px solid ${emiM===m ? C.accent : C.border}`, background: emiM===m ? C.accentLight : C.paper, color: emiM===m ? C.accent : C.muted, cursor: "pointer", transition: "all .2s" }}>{m} mo</button>
                  ))}
                </div>
              </div>
              <Field label="Interest Rate (0 for no-cost EMI)" value={intR} onChange={setIntR} prefix="%" suffix="p.a." hint="Most bank no-cost EMIs are 0%" />
            </>
          )}
          {(payT === "monthly" || payT === "yearly") && (
            <div style={{ background: C.amberLight, border: `1px solid ${C.amber}30`, borderRadius: 8, padding: "10px 14px", fontFamily: "'DM Mono', monospace", fontSize: 11, color: C.amber, marginBottom: 8 }}>
              {payT === "monthly" ? `Yearly cost = ₹${fmt(n(price)*12)} · Daily cost = ₹${fmtD(n(price)*12/365)}`
                                 : `Monthly cost = ₹${fmt(n(price)/12)} · Daily cost = ₹${fmtD(n(price)/365)}`}
            </div>
          )}
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <Btn variant="outline" onClick={() => setPhase(1)}>← Back</Btn>
            <Btn onClick={calc} disabled={!canCalc}>Get My Verdict →</Btn>
          </div>
        </div>
      )}

      {phase === 3 && result && (
        <div>
          <div style={{ background: result.verdict.bg, border: `1.5px solid ${result.verdict.color}30`, borderRadius: 14, padding: "22px 24px", marginBottom: 16, textAlign: "center" }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 28, color: result.verdict.color, marginBottom: 6 }}>{result.verdict.icon}</div>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 32, color: result.verdict.color, marginBottom: 8 }}>{result.verdict.label}</div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
              {item} · ₹{fmt(result.totalCost)} total cost
            </div>
          </div>
          <div style={{ background: C.paper, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px 18px", marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'DM Mono', monospace", fontSize: 9, color: C.muted, marginBottom: 6 }}>
              <span>GREAT (0.5x)</span><span>FINE (1.0x)</span><span>WORST (1.5x+)</span>
            </div>
            <div style={{ height: 8, background: C.bg, borderRadius: 99, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${Math.min((result.ratio/2)*100, 100)}%`, background: `linear-gradient(90deg, ${C.accent}, ${C.amber}, ${C.red})`, borderRadius: 99, transition: "width 1s cubic-bezier(.34,1.56,.64,1)" }} />
            </div>
            <div style={{ textAlign: "right", fontFamily: "'DM Mono', monospace", fontSize: 11, color: result.verdict.color, marginTop: 6 }}>Score: {result.ratio.toFixed(2)}x</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
            <Pill label="Daily Surplus" value={`₹${fmt(dailySurp)}`} color={C.accent} />
            <Pill label="Total Cost" value={`₹${fmt(result.totalCost)}`} color={C.ink} />
            <Pill label="Days to Recover" value={`${fmtD(result.daysRec)} days`} color={result.verdict.color} />
            <Pill label="Months to Recover" value={`${fmtD(result.monthsRec)} mo`} color={result.verdict.color} />
          </div>
          {payT === "emi" && (
            <div style={{ background: C.paper, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px 18px", marginBottom: 14 }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.muted, marginBottom: 10 }}>RECOVERY vs EMI WINDOW</div>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ height: 5, background: C.bg, borderRadius: 99, overflow: "hidden", marginBottom: 5 }}>
                    <div style={{ height: "100%", width: `${Math.min((result.monthsRec/emiM)*100,100)}%`, background: result.verdict.color, borderRadius: 99, transition: "width 1s ease" }} />
                  </div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: result.verdict.color }}>Recovery: {fmtD(result.monthsRec)} months</div>
                </div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: C.muted, whiteSpace: "nowrap" }}>/ EMI: {emiM} months</div>
              </div>
            </div>
          )}
          <div style={{ display: "flex", gap: 10 }}>
            <Btn variant="outline" onClick={() => setPhase(2)}>← Edit</Btn>
            <Btn variant="ghost" onClick={() => { setPhase(1); setIncome(""); setSpend(""); setItem(""); setPrice(""); setIntR("0"); setResult(null); }}>Start Fresh</Btn>
          </div>
        </div>
      )}
    </div>
  );
}

const ITEM_PRESETS = [
  { label: "📱 Flagship Phone",   price: 75000,  type: "emi",     emiM: 6  },
  { label: "💻 Laptop",           price: 90000,  type: "emi",     emiM: 12 },
  { label: "🏍 Bike",             price: 150000, type: "emi",     emiM: 24 },
  { label: "🎧 Earbuds",          price: 20000,  type: "full",    emiM: 1  },
  { label: "📺 Netflix",          price: 649,    type: "monthly", emiM: 1  },
  { label: "🤖 AI Subscription",  price: 1999,   type: "monthly", emiM: 1  },
  { label: "🏋 Gym",              price: 2500,   type: "monthly", emiM: 1  },
  { label: "🛍 Monthly Shopping", price: 5000,   type: "monthly", emiM: 1  },
];

function IncomeGoalCalc() {
  const [items,    setItems]   = useState([]);
  const [essentials, setEss]   = useState("");
  const [newItem,  setNewItem] = useState({ name: "", price: "", type: "emi", emiM: 6 });
  const [result,   setResult]  = useState(null);
  const [showAdd,  setShowAdd] = useState(false);

  function addItem(it) { setItems(prev => [...prev, { ...it, id: Date.now() + Math.random() }]); }
  function removeItem(id) { setItems(prev => prev.filter(i => i.id !== id)); }

  function addCustom() {
    if (!newItem.name || !n(newItem.price)) return;
    addItem({ name: newItem.name, price: n(newItem.price), type: newItem.type, emiM: newItem.emiM });
    setNewItem({ name: "", price: "", type: "emi", emiM: 6 });
    setShowAdd(false);
  }

  function getMonthly(it) {
    if (it.type === "monthly") return n(it.price);
    if (it.type === "yearly")  return n(it.price) / 12;
    if (it.type === "emi")     return n(it.price) / it.emiM;
    return n(it.price);
  }

  function calculate() {
    const E = n(essentials);
    const totalMonthly = items.reduce((s, it) => s + getMonthly(it), 0);
    const tiers = TIERS.map(t => ({
      ...t,
      monthlyIncome: E + (totalMonthly / (t.pct / 100)),
      yearlyIncome:  (E + (totalMonthly / (t.pct / 100))) * 12,
    }));
    setResult({ E, totalMonthly, tiers, items: [...items] });
  }

  const typeLabel = { emi: "EMI", monthly: "/mo", yearly: "/yr", full: "one-time" };

  return (
    <div style={{ animation: "fadeUp .35s ease" }}>
      <div style={{ marginBottom: 22 }}>
        <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: C.ink, marginBottom: 4 }}>What Must I Earn?</div>
        <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
          Add the things you want. We'll tell you exactly what income target you need at three different comfort levels.
        </div>
      </div>

      <Field label="Monthly Essential Expenses (rent, food, transport, bills)" value={essentials} onChange={setEss}
        hint="Skip if you're a student or don't know yet. We'll still give you the desire-cost breakdown." />

      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <Label>Desired Items & Spends</Label>
          {items.length > 0 && <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.accent }}>{items.length} added</span>}
        </div>
        <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 12 }}>
          {ITEM_PRESETS.map((p, i) => (
            <button key={i} onClick={() => addItem({ name: p.label, price: p.price, type: p.type, emiM: p.emiM })}
              style={{ padding: "7px 12px", borderRadius: 20, border: `1px solid ${C.border}`, background: C.paper, fontFamily: "'Outfit', sans-serif", fontSize: 12, color: C.ink, cursor: "pointer", transition: "all .15s" }}
              onMouseOver={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.color = C.accent; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.ink; }}
            >{p.label}</button>
          ))}
        </div>
        {items.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
            {items.map(it => (
              <div key={it.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: C.paper, border: `1px solid ${C.border}`, borderRadius: 10, padding: "11px 14px" }}>
                <div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 600, color: C.ink }}>{it.name}</div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.muted, marginTop: 2 }}>
                    ₹{fmt(it.price)} · {typeLabel[it.type]}{it.type === "emi" ? ` ${it.emiM}mo` : ""} · ₹{fmt(getMonthly(it))}/mo
                  </div>
                </div>
                <button onClick={() => removeItem(it.id)} style={{ border: "none", background: "none", color: C.muted, fontSize: 16, cursor: "pointer", padding: "4px 6px", borderRadius: 6 }}>×</button>
              </div>
            ))}
          </div>
        )}
        {showAdd ? (
          <div style={{ background: C.accentLight, border: `1.5px solid ${C.accent}30`, borderRadius: 12, padding: 16, marginBottom: 8 }}>
            <Label>Custom Item</Label>
            <input type="text" value={newItem.name} onChange={e => setNewItem(p => ({...p, name: e.target.value}))} placeholder="Item name"
              style={{ width: "100%", boxSizing: "border-box", background: C.paper, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 12px", fontFamily: "'DM Mono', monospace", fontSize: 13, outline: "none", marginBottom: 10, color: C.ink }} />
            <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
              <div style={{ flex: 1 }}>
                <Label>Price</Label>
                <input type="text" inputMode="numeric" value={newItem.price ? fmtInput(newItem.price) : ""}
                  onChange={e => { const raw = e.target.value.replace(/,/g,"").replace(/[^0-9]/g,""); setNewItem(p => ({...p, price: raw})); }}
                  placeholder="0"
                  style={{ width: "100%", boxSizing: "border-box", background: C.paper, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 12px", fontFamily: "'DM Mono', monospace", fontSize: 13, outline: "none", color: C.ink }} />
              </div>
              <div style={{ flex: 1 }}>
                <Label>Type</Label>
                <select value={newItem.type} onChange={e => setNewItem(p => ({...p, type: e.target.value}))}
                  style={{ width: "100%", background: C.paper, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 12px", fontFamily: "'DM Mono', monospace", fontSize: 13, outline: "none", color: C.ink }}>
                  <option value="emi">EMI</option>
                  <option value="full">Full Payment</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            </div>
            {newItem.type === "emi" && (
              <div style={{ marginBottom: 10 }}>
                <Label>EMI Months</Label>
                <div style={{ display: "flex", gap: 6 }}>
                  {[3,6,9,12,18,24].map(m => (
                    <button key={m} onClick={() => setNewItem(p => ({...p, emiM: m}))}
                      style={{ padding: "7px 10px", borderRadius: 7, border: `1px solid ${newItem.emiM===m?C.accent:C.border}`, background: newItem.emiM===m?C.accentLight:C.paper, fontFamily: "'DM Mono', monospace", fontSize: 11, color: newItem.emiM===m?C.accent:C.muted, cursor: "pointer" }}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div style={{ display: "flex", gap: 8 }}>
              <Btn variant="ghost" onClick={addCustom}>Add Item</Btn>
              <Btn variant="outline" onClick={() => setShowAdd(false)}>Cancel</Btn>
            </div>
          </div>
        ) : (
          <button onClick={() => setShowAdd(true)} style={{ width: "100%", padding: "11px", borderRadius: 10, border: `1.5px dashed ${C.border}`, background: "transparent", fontFamily: "'DM Mono', monospace", fontSize: 12, color: C.muted, cursor: "pointer" }}>
            + Add custom item
          </button>
        )}
      </div>

      <Btn onClick={calculate} disabled={items.length === 0}>Calculate My Income Target →</Btn>

      {result && (
        <div style={{ marginTop: 24, animation: "fadeUp .4s ease" }}>
          <div style={{ height: 1, background: C.border, marginBottom: 24 }} />
          <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, color: C.ink, marginBottom: 4 }}>Your Income Targets</div>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: C.muted, marginBottom: 20 }}>
            Based on ₹{fmt(result.totalMonthly)}/month in new desires{result.E > 0 ? ` + ₹${fmt(result.E)}/month essentials` : ""}.
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
            {result.tiers.map((t, i) => (
              <div key={t.key} style={{ background: i === 2 ? C.accentLight : C.paper, border: `1.5px solid ${i === 2 ? C.accent+"50" : C.border}`, borderRadius: 14, padding: "18px 20px", position: "relative", overflow: "hidden" }}>
                {i === 2 && <div style={{ position: "absolute", top: 14, right: 14, fontFamily: "'DM Mono', monospace", fontSize: 9, color: C.accent, letterSpacing: "0.12em", background: C.accentLight, padding: "3px 8px", borderRadius: 20, border: `1px solid ${C.accent}30` }}>TARGET ZONE</div>}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: t.color, letterSpacing: "0.12em", marginBottom: 5 }}>{t.label.toUpperCase()}</div>
                    <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, color: C.ink }}>₹{fmt(t.monthlyIncome)}<span style={{ fontSize: 14, fontFamily: "'DM Mono', monospace", color: C.muted }}>/mo</span></div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: C.muted, marginTop: 3 }}>₹{fmt(t.yearlyIncome)} yearly</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: C.muted, marginBottom: 4 }}>DESIRES = {t.pct}% OF SURPLUS</div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: t.color }}>₹{fmt(t.monthlyIncome - result.E)}<span style={{ fontSize: 10, color: C.muted }}> free/mo</span></div>
                  </div>
                </div>
                <div style={{ marginTop: 10, fontFamily: "'Outfit', sans-serif", fontSize: 12, color: C.muted }}>{t.desc}</div>
                <div style={{ marginTop: 12, height: 4, background: C.bg, borderRadius: 99 }}>
                  <div style={{ height: "100%", width: `${t.pct}%`, background: t.color, borderRadius: 99 }} />
                </div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: C.muted, marginTop: 4 }}>{t.pct}% of surplus goes to these desires</div>
              </div>
            ))}
          </div>
          <div style={{ background: C.paper, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px 18px", marginBottom: 14 }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.muted, marginBottom: 12 }}>MONTHLY COST BREAKDOWN</div>
            {result.items.map((it, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i < result.items.length - 1 ? `1px solid ${C.border}` : "none" }}>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: C.ink }}>{it.name}</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: C.muted }}>₹{fmt(getMonthly(it))}/mo</div>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 10, marginTop: 4 }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 500, color: C.ink }}>Total Monthly</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, fontWeight: 600, color: C.ink }}>₹{fmt(result.totalMonthly)}/mo</div>
            </div>
          </div>
          <div style={{ background: C.amberLight, border: `1px solid ${C.amber}40`, borderRadius: 10, padding: "12px 16px", fontFamily: "'DM Mono', monospace", fontSize: 11, color: C.amber, lineHeight: 1.7 }}>
            💡 These are net take-home targets, not CTC. Add 20-30% for taxes and PF if you're salaried.
          </div>
          <div style={{ marginTop: 16 }}>
            <Btn variant="outline" onClick={() => { setResult(null); setItems([]); setEss(""); }}>Reset & Start Over</Btn>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("goal");
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
          Two tools. One to check if you can afford something today. One to know what you need to earn to afford it comfortably.
        </p>
      </div>
      <div style={{ maxWidth: 520, width: "100%", marginBottom: 24 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { v: "goal",  title: "What Must I Earn?", sub: "Set your income target", icon: "↑" },
            { v: "check", title: "Can I Afford This?", sub: "Check affordability now", icon: "⚖" },
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
