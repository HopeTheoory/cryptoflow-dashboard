# CryptoFlow Dashboard — API Specification

## Binance WebSocket API (Free — No API Key Needed)

### Trade Stream Endpoint

```
wss://stream.binance.com:9443/ws/btcusdt@trade
```

### Raw Message Format (from Binance)

```json
{
  "e": "trade",        // Event type
  "E": 1710000000000, // Event time (ms)
  "s": "BTCUSDT",     // Symbol
  "t": 12345678,      // Trade ID
  "p": "74250.50",    // Price (string)
  "q": "0.00150",     // Quantity in BTC (string)
  "b": 88504,         // Buyer order ID
  "a": 50004,         // Seller order ID
  "T": 1710000000000, // Trade time (ms)
  "m": true,          // Is buyer the market maker? true = SELL trade
  "M": true           // Ignore
}
```

### Parsed Trade Object (our internal format)

```javascript
{
  price:    74250.50,          // parseFloat(msg.p)
  qty:      0.00150,           // parseFloat(msg.q)
  usdValue: 74250.50 * 0.0015, // price * qty
  isBuy:    !msg.m,            // m=true means seller is maker = buy pressure
  time:     msg.T,             // Unix timestamp ms
  bucket:   'allOrders',       // Classified by dataProcessor
  binKey:   74200,             // Floor to nearest $50
}
```

### Additional Free Streams

| Stream | URL | Use |
|--------|-----|-----|
| Kline/Candle | `wss://stream.binance.com:9443/ws/btcusdt@kline_1m` | OHLC candles |
| Book Depth | `wss://stream.binance.com:9443/ws/btcusdt@depth20` | Order book |
| 24hr Ticker | `wss://stream.binance.com:9443/ws/btcusdt@ticker` | Stats |

### REST Endpoint for Historical Candles (No Key)

```
GET https://api.binance.com/api/v3/klines
  ?symbol=BTCUSDT
  &interval=1m
  &limit=500
```

Response: Array of `[openTime, open, high, low, close, volume, ...]`

Use this to pre-load price history on page load before WebSocket catches up.

---

## Internal Data Processing API

### dataProcessor.js

```javascript
/**
 * Classify a trade by USD value into a bucket key
 * @param {number} usdValue
 * @returns {string} bucket key
 */
export function classifyBucket(usdValue) {}

/**
 * Round price down to nearest PRICE_BIN_SIZE
 * @param {number} price
 * @returns {number} bin key
 */
export function getBinKey(price) {}

/**
 * Process a raw Binance trade message into our format
 * and dispatch to store
 * @param {object} rawMsg - raw Binance WebSocket message
 */
export function processTrade(rawMsg) {}
```

### cvdCalculator.js

```javascript
/**
 * Append a new CVD data point to a series
 * @param {Array} series - existing CVD series [{time, value}]
 * @param {object} trade - processed trade object
 * @returns {Array} updated series
 */
export function updateCVD(series, trade) {}

/**
 * Normalize a CVD series to 0-1 range
 * @param {Array} series - CVD series
 * @returns {Array} normalized series
 */
export function normalizeSeries(series) {}
```

### binanceWS.js

```javascript
/**
 * Connect to Binance WebSocket trade stream
 * @param {string} symbol - e.g. 'btcusdt'
 */
export function connect(symbol = 'btcusdt') {}

/**
 * Disconnect and cleanup
 */
export function disconnect() {}

/**
 * Get connection status
 * @returns {'connected'|'connecting'|'disconnected'|'error'}
 */
export function getStatus() {}
```

---

## Rate Limits (Binance)

| Type | Limit |
|------|-------|
| WebSocket connections | 300 per 5 min per IP |
| WebSocket streams per connection | 1024 |
| REST requests | 1200 weight per minute |
| Historical klines (REST) | Weight = 2 |

**Note:** For this dashboard you will only use 1 WebSocket connection. You are well within limits.

---

## Error Codes to Handle

| Code | Meaning | Action |
|------|---------|--------|
| 1006 | Abnormal closure | Reconnect with backoff |
| 1001 | Going away | Reconnect |
| 1011 | Server error | Reconnect with backoff |
| `null` msg | Parse failure | Log and skip |
