
import React from 'react';
import { C } from '../theme/constants';

export function Pill({ label, value, color, sub }) {
  return (
    <div style={{ background: C.paper, border: `1px solid ${C.border}`, borderRadius: 10, padding: "13px 15px", flex: 1 }}>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 5 }}>{label}</div>
      <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 17, fontWeight: 700, color: color || C.ink }}>{value}</div>
      {sub && <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.muted, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}
