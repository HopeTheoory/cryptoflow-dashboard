# CryptoFlow Dashboard — Technical Architecture

## System Design

```
Binance WebSocket API
        │
        ▼
  binanceWS.js          ← Connects, receives raw trade data
        │
        ▼
 dataProcessor.js       ← Bins data by price level + order size
        │
        ▼
  useStore.js (Zustand) ← Global state, single source of truth
     │         │
     ▼         ▼
HeatmapChart  CVDPanel  ← React components subscribe to store
     │
     ▼
PriceChart               ← Overlaid on heatmap
```

## Data Flow (Step by Step)

1. `binanceWS.js` connects to `wss://stream.binance.com:9443/ws/btcusdt@trade`
2. Each trade message arrives: `{ price, qty, isBuyerMaker, time }`
3. `dataProcessor.js` classifies trade by USD value → size bucket
4. Trade is binned by price level (rounded to nearest $50)
5. CVD is updated: buy = +qty, sell = −qty
6. Zustand store is updated
7. React components re-render with new data

## Zustand Store Schema

```javascript
// src/store/useStore.js
{
  // Heatmap data: price_level → { volume, cvd }
  heatmapBins: Map<number, { volume: number, cvd: number }>,

  // CVD series per bucket over time
  cvdSeries: {
    allOrders:    Array<{ time, value }>,
    s100to1k:     Array<{ time, value }>,
    s1kto10k:     Array<{ time, value }>,
    s10kto100k:   Array<{ time, value }>,
    s100kto1M:    Array<{ time, value }>,
    s1Mto10M:     Array<{ time, value }>,
  },

  // Live price
  currentPrice: number,

  // Price history for chart
  priceHistory: Array<{ time, open, high, low, close }>,

  // UI state
  timeframe: '1D' | '1W' | '1M' | '6M' | '1Y' | '3Y',
  viewMode: 'Normalized CVD' | 'Absolute CVD',

  // Actions
  addTrade: (trade) => void,
  setTimeframe: (tf) => void,
  setViewMode: (mode) => void,
}
```

## Order Size Buckets

| Bucket Key | USD Range | Chart Color |
|------------|-----------|-------------|
| `allOrders` | All | Blue |
| `s100to1k` | $100 – $1,000 | Orange |
| `s1kto10k` | $1,000 – $10,000 | Green |
| `s10kto100k` | $10,000 – $100,000 | Red |
| `s100kto1M` | $100,000 – $1,000,000 | Purple |
| `s1Mto10M` | $1,000,000 – $10,000,000 | Yellow |

## Heatmap Binning Rules

- Price bin size: `$50` (configurable constant `PRICE_BIN_SIZE = 50`)
- Bin key = `Math.floor(price / PRICE_BIN_SIZE) * PRICE_BIN_SIZE`
- Max bins stored in memory: `500` (prune oldest on overflow)
- Color scale: `chroma.js` scale from dark red → yellow → white (high volume)
- Volume threshold for white: `top 1% of all bin volumes`

## WebSocket Reconnection Strategy

```javascript
// Reconnect with exponential backoff
reconnectDelay = min(reconnectDelay * 2, MAX_DELAY)
// MAX_DELAY = 30000ms
// Initial delay = 1000ms
// Max retries = 10
```

## Performance Rules

- Heatmap canvas renders at max 10fps (throttle with `requestAnimationFrame`)
- CVD chart updates at max 1Hz
- Price chart updates at max 2Hz
- Keep max 2000 data points per CVD series (FIFO queue)
- Use `useMemo` for expensive chart transformations
