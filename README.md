# 💰 Smart Budget Allocation AI

A fully client-side personal finance planner that generates a personalised monthly budget plan based on your income, city, family size and spending priorities — no backend, no install, just open in a browser.

---

## 📁 Project Structure

```
BUDGET/
├── index.html   →  3-page single-page app shell
├── style.css    →  Glassmorphism UI, animations, responsive layout
├── app.js       →  Page navigation, form logic, chart & PDF rendering
├── logic.js     →  Budget calculation engine, warnings, investment advice
└── cities.js    →  160 world cities with currency codes & symbols
```

---

## ✨ Features

| Feature | Detail |
|---|---|
| 🌍 City-aware currency | 160 cities · 50+ countries · auto-fills currency symbol |
| 🎚 Priority sliders | Rate 9 spending categories 1–10 to personalise allocation |
| 👨‍👩‍👧 Family scaling | Larger families auto-increase food & medical weights |
| 💰 Savings enforcement | Savings never fall below your target (floor-guarded) |
| 📊 Pie chart | Interactive Chart.js distribution chart |
| 📝 AI summary | Personalised narrative + financial health warnings |
| 📈 Investment tips | Contextual tips based on savings amount & salary range |
| 📄 PDF export | One-click PDF via jsPDF + html2canvas |
| 📱 Responsive | Single-column layout on mobile (≤ 768 px) |

---

## 🚀 Getting Started

No installation needed. Just open the file:

```
Double-click index.html
```

> **Tip:** Use VS Code Live Server for the smoothest experience,  
> especially for PDF export to work correctly.

---

## 🔄 App Flow

### Page 1 — Login
- Enter your **Full Name** (letters only, min 3 characters).
- Search and select your **City** from the autocomplete dropdown.
- Your **Country** and **Currency** are shown instantly.

### Page 2 — Financial Details
- Enter your **Monthly Salary**, **Family Size**, and **Savings Target (%)**.
- Adjust priority sliders (1 = lowest, 10 = highest) for each category:

| # | Category | Icon | Essential |
|---|---|---|---|
| 1 | Food & Groceries | 🍽 | ✅ |
| 2 | Rent / Housing | 🏠 | ✅ |
| 3 | Utilities | 💡 | ✅ |
| 4 | Transportation | 🚗 | — |
| 5 | Medical & Healthcare | 🏥 | ✅ |
| 6 | Education | 📚 | — |
| 7 | Entertainment | 🎬 | — |
| 8 | Insurance | 🛡 | — |
| 9 | Miscellaneous | 📦 | — |

### Page 3 — Results
- **Allocation table** — amount, percentage, mini progress bar per category.
- **Pie chart** — full colour distribution.
- **Personalised summary** — narrative mentioning your top spend areas.
- **Warnings** — automatic alerts for risky allocations.
- **Investment suggestions** — tiered advice based on your savings level.
- **Actions** — Start Over · Previous Page · Print as PDF.

---

## ⚙️ Budget Engine (`logic.js`)

### Calculation Steps

1. **Base weights** — sensible defaults for each category:

   | Category | Default % |
   |---|---|
   | Rent | 25 |
   | Food | 15 |
   | Utilities | 10 |
   | Transport | 8 |
   | Misc | 7 |
   | Savings | *your target* |
   | Education | 5 |
   | Medical | 5 |
   | Entertainment | 5 |
   | Insurance | 5 |

2. **Family factor** — family > 1 adds `(size − 1) × 2` to food; family > 4 adds +10 food, +5 medical.
3. **Priority adjustment** — each slider shifts weight by `(priority − 5.5) × 1.5`.
4. **Floor guards** — Savings ≥ target %; Food, Rent, Utilities, Medical each ≥ 5%.
5. **Normalisation** — all weights scaled proportionally to sum to 100%.

### Warnings Generated
| Condition | Warning |
|---|---|
| Rent > 40 % | ⚠️ Consider downsizing |
| Savings < 10 % | ⚠️ Financial buffer is low |

### Investment Suggestions (Tiered)
| Savings Amount | Tip Unlocked |
|---|---|
| Any | Emergency fund target, Mutual Funds, Index Funds |
| > 5,000 | Fixed Deposits, Gold investments |
| > 10,000 | Retirement Planning, SIP |
| Savings > 25 % | Aggressive equity-linked growth strategies |
| Salary < 2,000 | Cost optimisation & expense tracking tip |

---

## 🎨 UI & Styling (`style.css`)

- **Theme** — deep purple radial gradient background (`#1e1b4b → #312e81`)
- **Glassmorphism** — `backdrop-filter: blur(25px)` frosted card container
- **Animated background** — 5-layer blurred radial colour blobs (fixed, z-index -1)
- **Font** — [Poppins](https://fonts.google.com/specimen/Poppins) (Google Fonts)
- **Transitions** — smooth page fade-in animation (`opacity + translateY`)
- **Cards** — each result section has a unique top-border accent colour:
  - Table → Neon Cyan `#18dcff`
  - Chart → Neon Pink `#ff4dff`
  - Summary → Vibrant Green `#3ae374`
  - Suggestions → Bright Orange `#ff9f1a`
- **Hover effects** — cards lift (`translateY(-5px)`), priority rows slide right

---

## 🌍 City Database (`cities.js`)

**160 cities** across **50+ countries** including:

`India · USA · UK · Japan · France · Germany · China · Russia · Brazil · Australia · Canada · UAE · Singapore · South Korea · Thailand · Indonesia · Malaysia · Philippines · Vietnam · Turkey · Saudi Arabia · Egypt · Nigeria · South Africa · Spain · Italy · Netherlands · Switzerland · and more…`

Each entry:
```js
{ city: "Mumbai", country: "India", currency: "INR", symbol: "₹" }
```

---

## 📦 Dependencies (CDN — no install)

| Library | Version | Use |
|---|---|---|
| [Chart.js](https://www.chartjs.org/) | latest | Pie chart |
| [jsPDF](https://github.com/parallax/jsPDF) | 2.5.1 | PDF generation |
| [html2canvas](https://html2canvas.hertzen.com/) | 1.4.1 | Page screenshot for PDF |
| [Google Fonts – Poppins](https://fonts.google.com/specimen/Poppins) | — | Typography |

---

## 📄 License

Free for personal and educational use. Fork and customize freely!
