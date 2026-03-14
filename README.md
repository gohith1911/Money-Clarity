# 💰 Money Clarity

> Two personal finance tools built for Indians who want data-backed decisions before spending money.

**Live Demo → [money-clarity.vercel.app](https://money-clarityy.vercel.app)**

---

## What is this?

Most people make purchase decisions based on gut feeling or peer pressure. Money Clarity gives you two tools to replace that with actual numbers.

### ⚖ Can I Afford This?
Enter your income, expenses, and the item you want to buy. Get a verdict — **Great / Good / Fine / Bad / Worst** — based on how long it takes your daily surplus to recover the cost vs your EMI window.

Supports:
- Full payment
- EMI plans (3 to 24 months) with optional interest
- Monthly recurring (subscriptions, gym, etc.)
- Yearly recurring (annual plans)

### ↑ What Must I Earn?
The reverse tool. Add the things you *want* in your life — flagship phone on EMI, Netflix, AI subscriptions, gym — and get the exact monthly income you need at three comfort levels:

| Level | Desires are... |
|---|---|
| Minimum | 40% of your surplus |
| Comfortable | 25% of your surplus |
| Freedom | 15% of your surplus — you barely feel it |

Built for **students, freelancers, and early earners** who don't have a fixed income yet but want to set real income targets around the life they want.

---

## Tech Stack

- React + TypeScript
- Vite
- Pure CSS-in-JS (no UI library)
- Deployed on Vercel

---

## Run Locally

```bash
git clone https://github.com/gohith1911/Money-Clarity.git
cd Money-Clarity
npm install
npm run dev
```

Open `http://localhost:5173`

---

## The Logic

**Affordability Score:**
```
Daily Surplus = (Yearly Income - Yearly Expenses) / 365
Days to Recover = Item Price / Daily Surplus
Score Ratio = Days to Recover / EMI Window Days
```

| Ratio | Verdict |
|---|---|
| ≤ 0.5x | 🚀 Great |
| ≤ 0.75x | ✅ Good |
| ≤ 1.0x | ⚖️ Fine |
| ≤ 1.5x | ⚠️ Bad |
| > 1.5x | 🚨 Worst |

**Income Goal:**
```
Required Monthly Income = Essentials + (Monthly Desire Cost / Tier%)
```

---

## License

MIT — free to use, modify, and share.

---

Built by [Gohith](https://github.com/gohith1911)
