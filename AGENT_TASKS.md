# CryptoFlow Dashboard — Agent Task Breakdown

## ⚠️ CRITICAL RULES FOR ALL AGENTS

1. **Each agent ONLY edits files in its assigned section**
2. **Never modify `useStore.js` schema** — only add new actions if needed, never rename existing ones
3. **Never change the Zustand store key names** — components depend on them
4. **Commit after every completed task** — never leave broken code uncommitted
5. **Read this document before every session** — it is the source of truth

---

## Agent A — Chart Rendering

**Owns:** `src/components/HeatmapChart.jsx`, `src/components/PriceChart.jsx`

**Does NOT touch:** WebSocket code, store actions, CVDPanel, Sidebar

### Tasks for Agent A

```
TASK A-1: Create HeatmapChart.jsx
- Use HTML5 Canvas (not SVG) for performance
- Read heatmapBins from useStore
- Color scale: black → dark red → orange → yellow → white
- Y-axis = price levels, X-axis = time (scrollable)
- Props: width, height (use ResizeObserver for responsiveness)
- Export: default export HeatmapChart

TASK A-2: Create PriceChart.jsx
- Use lightweight-charts library (TradingView)
- Read priceHistory and currentPrice from useStore
- Render as a line chart overlaid on heatmap area
- Use a transparent background so heatmap shows behind it
- Export: default export PriceChart

TASK A-3: Combine into ChartPanel.jsx
- Renders HeatmapChart as base layer
- Renders PriceChart as absolute-positioned overlay
- Handles shared Y-axis alignment (price scale must match)
```

### Interface Contract (do not change these)

```javascript
// What Agent A reads from store:
store.heatmapBins   // Map<number, { volume, cvd }>
store.priceHistory  // Array<{ time, open, high, low, close }>
store.currentPrice  // number
store.timeframe     // string

// What Agent A must NOT write to store
// Charts are READ-ONLY consumers
```

---

## Agent B — Data Layer

**Owns:** `src/services/binanceWS.js`, `src/services/dataProcessor.js`, `src/utils/cvdCalculator.js`, `src/store/useStore.js`

**Does NOT touch:** Any component files, styling, or Sidebar

### Tasks for Agent B

```
TASK B-1: Create binanceWS.js
- Connect to wss://stream.binance.com:9443/ws/btcusdt@trade
- Parse incoming messages to: { price, qty, usdValue, isBuy, time }
- Call dataProcessor.processTrade(trade) on each message
- Implement reconnection with exponential backoff
- Export: { connect, disconnect }

TASK B-2: Create dataProcessor.js
- Function: classifyBucket(usdValue) → bucket key string
- Function: getBinKey(price) → nearest $50 bin number
- Function: processTrade(trade) → calls store.addTrade(processed)
- Export: { processTrade, classifyBucket, getBinKey }

TASK B-3: Create cvdCalculator.js
- Function: updateCVD(series, trade) → new series with appended point
- Handles normalization for Normalized CVD view mode
- Handles absolute values for Absolute CVD view mode
- Export: { updateCVD, normalizeSeries }

TASK B-4: Implement useStore.js
- Use Zustand (create from 'zustand')
- Implement full store schema as defined in ARCHITECTURE.md
- Implement addTrade action: bins trade, updates CVD series, updates price
- Export: default export useStore
```

### Interface Contract (do not change these)

```javascript
// Trade object shape that MUST be consistent:
const trade = {
  price: number,      // e.g. 74250.5
  qty: number,        // BTC amount
  usdValue: number,   // price * qty
  isBuy: boolean,     // true = buyer maker
  time: number,       // unix timestamp ms
  bucket: string,     // 's100to1k' | 's1kto10k' | etc.
  binKey: number,     // e.g. 74200
}
```

---

## Agent C — UI Shell

**Owns:** `src/components/Sidebar.jsx`, `src/components/TimeframeSelector.jsx`, `src/App.jsx`, all Tailwind styling

**Does NOT touch:** Chart rendering code, WebSocket code, store logic

### Tasks for Agent C

```
TASK C-1: Create Sidebar.jsx
- Dark theme matching screenshot (#0d0d0d background)
- Navigation items: Home, Apps > Spot > FireCharts / GlobalAnalysis, Futures > Funding
- Show signed-in user (hardcode "Keith Alan" initially)
- Profile and Sign Out buttons at bottom
- Use Tailwind CSS only

TASK C-2: Create TimeframeSelector.jsx
- Buttons: 1D, 1W, 1M, 6M, 1Y, 3Y
- Toggle buttons: Normalized CVD, Absolute CVD
- On click: call store.setTimeframe() and store.setViewMode()
- Highlight active selection

TASK C-3: Update App.jsx
- Layout: Sidebar (fixed left, 200px) + Main content area
- Main area: TimeframeSelector on top, ChartPanel below
- Call binanceWS.connect() on mount
- Call binanceWS.disconnect() on unmount

TASK C-4: Create CVDLegend.jsx
- Shows color-coded lines matching CVDPanel series
- Labels: All Orders, $100–$1k, $1k–$10k, $10k–$100k, $100k–$1M, $1M–$10M
```

---

## Shared Constants File

**ALL agents read from this — NEVER duplicate these values:**

```javascript
// src/constants.js  ← Agent B creates this, everyone reads it

export const PRICE_BIN_SIZE = 50;
export const MAX_BINS = 500;
export const MAX_CVD_POINTS = 2000;
export const HEATMAP_FPS = 10;
export const CVD_UPDATE_HZ = 1;

export const BUCKETS = {
  allOrders:  { label: 'All Orders',    color: '#3b82f6', min: 0,        max: Infinity },
  s100to1k:   { label: '$100 to $1k',   color: '#f97316', min: 100,      max: 1000 },
  s1kto10k:   { label: '$1k to $10k',   color: '#22c55e', min: 1000,     max: 10000 },
  s10kto100k: { label: '$10k to $100k', color: '#ef4444', min: 10000,    max: 100000 },
  s100kto1M:  { label: '$100k to $1M',  color: '#a855f7', min: 100000,   max: 1000000 },
  s1Mto10M:   { label: '$1M to $10M',   color: '#eab308', min: 1000000,  max: 10000000 },
};
```

---

## Merge Order

Deploy in this exact order to avoid merge conflicts:

1. `constants.js` (Agent B commits first)
2. `useStore.js` (Agent B)
3. `dataProcessor.js` + `cvdCalculator.js` + `binanceWS.js` (Agent B)
4. `HeatmapChart.jsx` + `PriceChart.jsx` (Agent A)
5. `CVDPanel.jsx` (Agent B)
6. `Sidebar.jsx` + `TimeframeSelector.jsx` (Agent C)
7. `App.jsx` (Agent C — final integration)
