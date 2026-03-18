# CryptoFlow Dashboard — Project Overview

## What We're Building
A real-time Bitcoin/crypto order flow dashboard with:
- **Binned CVD Heatmap** — color-coded volume by price level (like FireCharts)
- **Price Overlay Chart** — live BTC/USDT price line
- **Normalized CVD Panel** — cumulative volume delta by order size buckets
- **Order Size Filters** — $100–$1k, $1k–$10k, $10k–$100k, $100k–$1M, $1M–$10M

## Tech Stack (All Free)

| Layer | Tool | Why |
|-------|------|-----|
| Frontend | React + Vite | Fast, modern, free |
| Charts | Lightweight-charts (TradingView) | Pro-grade, free |
| Heatmap | D3.js | Full control |
| Data | Binance WebSocket API | Free, no key needed |
| State | Zustand | Lightweight |
| Styling | Tailwind CSS | Rapid UI |
| Hosting | GitHub Pages / Vercel | Free |
| Version Control | GitHub | Free |

## Free AI Agentic Coders to Use

| Agent | Role | Where to Get |
|-------|------|--------------|
| **Cursor** | Main IDE + AI coder | cursor.sh (free tier) |
| **Aider** | Terminal AI pair programmer | aider.chat (free, uses own API key) |
| **GitHub Copilot** | Inline suggestions | github.com/copilot (free tier) |
| **v0 by Vercel** | UI component generation | v0.dev (free tier) |
| **Bolt.new** | Full-stack scaffolding | bolt.new (free tier) |

## Project Folder Structure

```
cryptoflow-dashboard/
├── src/
│   ├── components/
│   │   ├── HeatmapChart.jsx       # Agent A owns this
│   │   ├── PriceChart.jsx         # Agent A owns this
│   │   ├── CVDPanel.jsx           # Agent B owns this
│   │   ├── Sidebar.jsx            # Agent C owns this
│   │   └── TimeframeSelector.jsx  # Agent C owns this
│   ├── services/
│   │   ├── binanceWS.js           # Agent B owns this
│   │   └── dataProcessor.js       # Agent B owns this
│   ├── store/
│   │   └── useStore.js            # Shared — do not conflict
│   ├── utils/
│   │   └── cvdCalculator.js       # Agent B owns this
│   ├── App.jsx
│   └── main.jsx
├── public/
├── docs/                          # All spec documents live here
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## Development Phases

| Phase | Task | Agent |
|-------|------|-------|
| 1 | Scaffold project + store + WebSocket service | Bolt.new |
| 2 | Build heatmap + price chart | Cursor / Agent A |
| 3 | Build CVD panel + data processing | Aider / Agent B |
| 4 | Build sidebar + UI shell | v0.dev / Agent C |
| 5 | Wire everything together | Cursor |
| 6 | Deploy to GitHub Pages | GitHub Actions |
