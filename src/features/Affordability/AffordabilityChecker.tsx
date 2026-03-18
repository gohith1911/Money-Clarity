
import { useState } from "react";
import { C } from "../../theme/constants";
import { Btn } from "../../components/Btn";
import { Field } from "../../components/Field";
import { Label } from "../../components/Label";
import { Pill } from "../../components/Pill";
import { Seg } from "../../components/Seg";
import { n, fmt, fmtD, calculateAffordability, AffordabilityResult, Verdict } from "../../utils/finance-utils";

const STRENGTH_MAP: { [key: Verdict['key']]: string } = {
  great: 'High Strength',
  good: 'High Strength',
  fine: 'Medium Strength',
  bad: 'Low Strength',
  worst: 'Low Strength',
};

export function AffordabilityChecker() {
  const [phase, setPhase] = useState(1);
  const [income, setIncome] = useState("");
  const [spend,  setSpend]  = useState("");
  const [item,   setItem]   = useState("");
  const [price,  setPrice]  = useState("");
  const [payT,   setPayT]   = useState<'emi' | 'full' | 'monthly' | 'yearly'>("emi");
  const [emiM,   setEmiM]   = useState(6);
  const [intR,   setIntR]   = useState("0");
  const [result, setResult] = useState<AffordabilityResult | null>(null);

  const dailyInc  = n(income) / 365;
  const dailySurp = (n(income) - n(spend)) / 365;
  const savPct    = n(income) > 0 ? (((n(income) - n(spend)) / n(income)) * 100).toFixed(1) : 0;
  const canP2     = n(income) > 0 && n(spend) > 0 && n(income) > n(spend);
  const canCalc   = item.trim() && n(price) > 0;

  function calc() {
    const calculationResult = calculateAffordability({ income, spend, price, payT, emiM, intR });
    setResult(calculationResult);
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
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: C.ink, marginBottom: 4 }}>The Foundation</div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: C.muted }}>Enter your yearly numbers. We'll figure out your daily buying power.</div>
          </div>
          <Field label="Yearly Income" value={income} onChange={setIncome} hint="All income sources combined" />
          <Field label="Yearly Total Expenses" value={spend} onChange={setSpend} hint="Rent, food, bills, existing EMIs, everything" />
          {canP2 && (
            <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
              <Pill label="Daily Income" value={`₹${fmt(dailyInc)}`} color={C.blue} />
              <Pill label="Daily Surplus" value={`₹${fmt(dailySurp)}`} color={C.accent} />
              <Pill label="Saved" value={`${savPct}%`} color={parseFloat(savPct) >= 30 ? C.accent : parseFloat(savPct) >= 15 ? C.amber : C.red} />
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
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: C.ink, marginBottom: 4 }}>The Purchase</div>
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
              <span>GREAT (0.5x)</span><span>You're on track (1.0x)</span><span>WORST (1.5x+)</span>
            </div>
            <div style={{ height: 8, background: C.bg, borderRadius: 99, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${Math.min((result.ratio/2)*100, 100)}%`, background: `linear-gradient(90deg, ${C.accent}, ${C.amber}, ${C.red})`, borderRadius: 99, transition: "width 1s cubic-bezier(.34,1.56,.64,1)" }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.muted }}>Affordability Strength</span>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: result.verdict.color }}>{STRENGTH_MAP[result.verdict.key]}</span>
            </div>
          </div>

          {(result.verdict.key === 'fine' || result.verdict.key === 'bad') && payT === 'emi' && (
            <div style={{ background: C.amberLight, border: `1px solid ${C.amber}40`, borderRadius: 10, padding: "12px 16px", fontFamily: "'DM Mono', monospace", fontSize: 11, color: C.amber, lineHeight: 1.7, marginBottom: 14 }}>
              💡 <b>Pro Tip:</b> Increasing your down payment could move this into the GREEN zone.
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
            <Pill label="Daily Surplus" value={`₹${fmt(dailySurp)}`} color={C.accent} />
            <Pill label="Total Cost" value={`₹${fmt(result.totalCost)}`} color={C.ink} />
            <Pill label="Days to 'Earn Back'" value={`${fmtD(result.daysRec)} days`} color={result.verdict.color} />
            <Pill label="Months to Recover" value={`${fmtD(result.monthsRec)} mo`} color={result.verdict.color} />
          </div>
          {payT === "emi" && (
            <div style={{ background: C.paper, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px 18px", marginBottom: 14 }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.muted, marginBottom: 10 }}>Recovery vs EMI Window</div>
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
