
import { C } from '../theme/constants';

export const n = (v: string | number): number => parseFloat(String(v).replace(/,/g, "")) || 0;
export const fmt = (v: number): string => Math.round(v).toLocaleString("en-IN");
export const fmtD = (v: number): string => parseFloat(v.toString()).toLocaleString("en-IN", { maximumFractionDigits: 1 });

// Format raw input string to Indian comma style as user types
export function fmtInput(raw: string): string {
  const digits = String(raw).replace(/,/g, "").replace(/[^0-9]/g, "");
  if (!digits) return "";
  return parseInt(digits, 10).toLocaleString("en-IN");
}

export const VERDICTS = [
  { key: "great",  label: "GREAT",  icon: "◆", color: C.accent,   bg: C.accentLight, ratio: [0, 0.5]        },
  { key: "good",   label: "GOOD",   icon: "●", color: "#2E7D52",   bg: "#EEF7F2",     ratio: [0.5, 0.75]    },
  { key: "fine",   label: "FINE",   icon: "◐", color: C.amber,     bg: C.amberLight,  ratio: [0.75, 1.0]    },
  { key: "bad",    label: "BAD",    icon: "▲", color: "#B8600A",   bg: "#FDF0E0",     ratio: [1.0, 1.5]     },
  { key: "worst",  label: "WORST",  icon: "■", color: C.red,       bg: C.redLight,    ratio: [1.5, Infinity] },
];
export type Verdict = typeof VERDICTS[0];
export const getVerdict = (r: number): Verdict | undefined => VERDICTS.find((v) => r >= v.ratio[0] && r < v.ratio[1]);

export const TIERS = [
  { key: "min",   label: "Essential",     pct: 40, desc: "Tight but possible. You can manage it.",      color: C.red    },
  { key: "comfy", label: "Balanced", pct: 25, desc: "Healthy balance. Room for savings too.",      color: C.amber  },
  { key: "free",  label: "Abundant",     pct: 15, desc: "You barely feel it. Fully comfortable zone.", color: C.accent },
];
export type Tier = typeof TIERS[0];

export interface AffordabilityInputs {
  income: string;
  spend: string;
  price: string;
  payT: 'emi' | 'full' | 'monthly' | 'yearly';
  emiM: number;
  intR: string;
}

export interface AffordabilityResult {
  totalCost: number;
  daysRec: number;
  monthsRec: number;
  ratio: number;
  verdict: Verdict;
}

export function calculateAffordability({ income, spend, price, payT, emiM, intR }: AffordabilityInputs): AffordabilityResult {
  const dailySurp = (n(income) - n(spend)) / 365;
  const ir = n(intR);
  let totalCost = n(price);
  if (payT === 'emi' && ir > 0) {
    totalCost = n(price) * (1 + (ir / 100) * (emiM / 12));
  }
  const daysRec = totalCost / dailySurp;
  const emiDays = payT === 'emi' ? emiM * 30 : 30;
  const ratio = daysRec / emiDays;
  const verdict = getVerdict(ratio);

  if (!verdict) {
    // This case should ideally not be hit if the VERDICTS ratios cover all possibilities up to Infinity.
    // However, to satisfy TypeScript's strict null checks and prevent returning a potentially undefined verdict,
    // we can either throw an error or default to the 'worst' case.
    // Let's choose a safe fallback.
    return {
      totalCost,
      daysRec,
      monthsRec: daysRec / 30,
      ratio,
      verdict: VERDICTS[VERDICTS.length - 1], // Default to the worst verdict
    };
  }
  
  return {
    totalCost,
    daysRec,
    monthsRec: daysRec / 30,
    ratio,
    verdict,
  };
}
