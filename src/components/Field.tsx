
import React, { useState } from 'react';
import { C } from '../theme/constants';
import { Label } from './Label';

// Format raw input string to Indian comma style as user types
function fmtInput(raw) {
  const digits = String(raw).replace(/,/g, "").replace(/[^0-9]/g, "");
  if (!digits) return "";
  return parseInt(digits, 10).toLocaleString("en-IN");
}

export function Field({ label, value, onChange, prefix = "₹", suffix, placeholder = "0", hint }) {
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
