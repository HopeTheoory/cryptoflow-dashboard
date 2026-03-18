# CryptoFlow Dashboard — Component Specification

## HeatmapChart.jsx

**Purpose:** Render price-binned volume as a heatmap using Canvas

### Props
```typescript
interface HeatmapChartProps {
  width: number;   // Canvas width in px (use ResizeObserver)
  height: number;  // Canvas height in px
}
```

### Behavior
- Read `heatmapBins` from `useStore`
- Map bin volume to color: `chroma.scale(['#1a0000', '#8b0000', '#ff4500', '#ffff00', '#ffffff'])`
- Y-axis: price levels (highest at top)
- X-axis: scrollable time axis
- Re-render when `heatmapBins` updates (max 10fps)
- Show Y-axis price labels on right side

### Canvas Drawing Order
1. Clear canvas
2. Draw bin rectangles (bottom layer)
3. Draw Y-axis grid lines
4. Draw Y-axis price labels

---

## PriceChart.jsx

**Purpose:** Overlay live price line on top of heatmap

### Props
```typescript
interface PriceChartProps {
  width: number;
  height: number;
  priceMin: number;  // Must match heatmap Y range
  priceMax: number;  // Must match heatmap Y range
}
```

### Behavior
- Use `lightweight-charts` `createChart()`
- Line series: `currentPrice` history
- Transparent chart background
- Shared Y-axis scale with heatmap (passed as props)
- Blue line color: `#3b82f6`

---

## CVDPanel.jsx

**Purpose:** Show cumulative volume delta lines by order size bucket

### Props
```typescript
interface CVDPanelProps {
  width: number;
  height: number;
}
```

### Behavior
- Read `cvdSeries` and `viewMode` from `useStore`
- If `viewMode === 'Normalized CVD'`: call `normalizeSeries()` on each series
- If `viewMode === 'Absolute CVD'`: use raw values
- Render 6 line series using `lightweight-charts`
- Y-axis: right side, labeled "Normalized CVD (arb. u.)" or "Absolute CVD"
- X-axis: shared time axis with price chart above

---

## Sidebar.jsx

**Purpose:** Navigation sidebar

### Props: none (uses internal state + router)

### Sections
```
Home
  └── Introduction
  └── Tutorials
  └── Contact

Apps
  Spot
    └── FireCharts   ← active page
    └── GlobalAnalysis
  Futures
    └── Funding

─────────────────
Signed in as: [username]
[Profile] [Sign Out]
```

### Styling
- Background: `#0d0d0d`
- Active item: teal left border + teal text
- Inactive: gray text, no border
- Width: 200px fixed

---

## TimeframeSelector.jsx

**Purpose:** Switch timeframe and CVD view mode

### Props: none (reads/writes to store)

### Buttons Row 1 (Timeframe)
`1D` | `1W` | `1M` | `6M` | `1Y` | `3Y`

### Buttons Row 2 (View Mode)
`Normalized CVD` | `Absolute CVD`

### Behavior
- Clicking timeframe calls `store.setTimeframe(tf)`
- Active button: solid teal background
- Inactive: dark background, gray border

---

## CVDLegend.jsx

**Purpose:** Color key for CVD panel lines

### Renders (in order):
- 🔵 All Orders
- 🟠 $100 to $1k
- 🟢 $1k to $10k
- 🔴 $10k to $100k
- 🟣 $100k to $1M
- 🟡 $1M to $10M

### Styling
- Two rows of 3 items each
- Small colored dash + label text
- Position: below CVD panel

---

## App.jsx Layout

```
┌─────────────────────────────────────────────────────┐
│  Sidebar (200px)  │  TimeframeSelector (full width) │
│                   ├─────────────────────────────────┤
│  Home             │                                 │
│  ▸ FireCharts     │   HeatmapChart + PriceChart     │
│  ▸ GlobalAnalysis │         (60% height)            │
│                   ├─────────────────────────────────┤
│  Futures          │                                 │
│  ▸ Funding        │   CVDPanel                      │
│                   │         (40% height)            │
│  [Profile]        ├─────────────────────────────────┤
│  [Sign Out]       │   CVDLegend                     │
└─────────────────────────────────────────────────────┘
```

### CSS Grid Setup
```css
body {
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-template-rows: 100vh;
  background: #0d0d0d;
  color: white;
}
```
