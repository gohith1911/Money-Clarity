
import React from 'react';
import { C } from '../theme/constants';

export function Label({ children }) {
  return (
    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, fontWeight: 500, color: C.muted, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 7 }}>
      {children}
    </div>
  );
}
