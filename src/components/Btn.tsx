
import React from 'react';
import { C } from '../theme/constants';

export function Btn({ children, onClick, disabled, variant = "primary" }) {
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
