
import React from 'react';
import { C } from '../theme/constants';

export function Seg({ options, value, onChange }) {
  return (
    <div style={{ display: "flex", background: C.bg, borderRadius: 10, padding: 4, gap: 3 }}>
      {options.map((o) => (
        <button key={o.v} onClick={() => onChange(o.v)} style={{ flex: 1, padding: "9px 6px", borderRadius: 7, border: "none", background: value === o.v ? C.paper : "transparent", boxShadow: value === o.v ? "0 1px 4px rgba(0,0,0,0.08)" : "none", fontFamily: "'DM Mono', monospace", fontSize: 11, color: value === o.v ? C.ink : C.muted, fontWeight: value === o.v ? 500 : 400, cursor: "pointer", transition: "all .2s" }}>{o.l}</button>
      ))}
    </div>
  );
}
