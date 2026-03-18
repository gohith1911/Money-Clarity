
import { useState } from "react";
import { C } from "../../theme/constants";
import { Btn } from "../../components/Btn";
import { Field } from "../../components/Field";
import { Label } from "../../components/Label";
import { n, fmt, fmtInput, TIERS } from "../../utils/finance-utils";

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

interface Item {
  id: number;
  name: string;
  price: number;
  type: 'emi' | 'full' | 'monthly' | 'yearly';
  emiM: number;
}

interface Result {
  E: number;
  totalMonthly: number;
  tiers: (typeof TIERS[0] & { monthlyIncome: number; yearlyIncome: number; })[];
  items: Item[];
}

export function IncomeGoalCalc() {
  const [items,    setItems]   = useState<Item[]>([]);
  const [essentials, setEss]   = useState("");
  const [newItem,  setNewItem] = useState({ name: "", price: "", type: 'emi', emiM: 6 });
  const [result,   setResult]  = useState<Result | null>(null);
  const [showAdd,  setShowAdd] = useState(false);

  function addItem(it: Omit<Item, 'id'>) { setItems(prev => [...prev, { ...it, id: Date.now() + Math.random() }]); }
  function removeItem(id: number) { setItems(prev => prev.filter(i => i.id !== id)); }

  function addCustom() {
    if (!newItem.name || !n(newItem.price)) return;
    addItem({ name: newItem.name, price: n(newItem.price), type: newItem.type as any, emiM: newItem.emiM });
    setNewItem({ name: "", price: "", type: 'emi', emiM: 6 });
    setShowAdd(false);
  }

  function getMonthly(it: Item) {
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
        <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: C.ink, marginBottom: 4 }}>Lifestyle Target</div>
        <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
        Design your lifestyle.
        </div>
      </div>

      <Field label="Monthly Essentials (rent, food, transport, bills)" value={essentials} onChange={setEss}
        hint="Optional: Leave as ₹0 if you're a student." />

      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <Label>Desired Items & Spends</Label>
          {items.length > 0 && <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.accent }}>{items.length} added</span>}
        </div>
        <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 12 }}>
          {ITEM_PRESETS.map((p, i) => (
            <button key={i} onClick={() => addItem({ name: p.label, price: p.price, type: p.type as any, emiM: p.emiM })}
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
                <select value={newItem.type} onChange={e => setNewItem(p => ({...p, type: e.target.value as any}))}
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
