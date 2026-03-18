import { BUCKETS, PRICE_BIN_SIZE } from '@/constants';
import { Trade } from '@/types';

// FIX #5 — typed interface instead of `any`
// gives TypeScript visibility into the raw Binance message shape
interface RawBinanceTrade {
  e: string;   // event type — should be 'trade'
  p: string;   // price as string  e.g. "74250.50"
  q: string;   // quantity as string e.g. "0.00150"
  T: number;   // trade time as unix ms timestamp
  m: boolean;  // true = seller is market maker = SELL pressure
}

// FIX #2 — this function now only classifies the SIZE BUCKET
// it no longer misuses 'allOrders' as a catch-all for tiny trades
// 'allOrders' is handled separately in the store's addTrade action
export function classifyBucket(usdValue: number): keyof typeof BUCKETS {
  if (usdValue < BUCKETS.s100to1k.min)   return 's100to1k';
  if (usdValue < BUCKETS.s1kto10k.min)   return 's1kto10k';
  if (usdValue < BUCKETS.s10kto100k.min) return 's10kto100k';
  if (usdValue < BUCKETS.s100kto1M.min)  return 's100kto1M';
  if (usdValue < BUCKETS.s1Mto10M.min)   return 's100kto1M';
  return 's1Mto10M';
}

export function getBinKey(price: number): number {
  return Math.floor(price / PRICE_BIN_SIZE) * PRICE_BIN_SIZE;
}

// FIX #5 — returns null instead of a corrupt Trade on invalid messages
// the caller in binanceWS.ts checks for null before calling addTrade
export function processTrade(msg: RawBinanceTrade): Trade | null {
  // Validate event type — Binance streams can send non-trade messages
  if (msg.e !== 'trade') return null;

  const price    = parseFloat(msg.p);
  const qty      = parseFloat(msg.q);
  const usdValue = price * qty;
  const isBuy    = !msg.m;
  const time     = msg.T;

  // FIX #5 — guard against NaN propagating into the store
  // NaN as a Map key corrupts heatmapBins permanently until page refresh
  if (!isFinite(price) || !isFinite(qty) || !time) {
    console.warn('Skipping malformed trade message:', msg);
    return null;
  }

  // FIX #2 — trades under $100 still get a specific bucket
  // 'allOrders' is no longer assigned here — it's updated in the store
  // for every trade unconditionally, regardless of size
  return {
    price,
    qty,
    usdValue,
    isBuy,
    time,
    bucket: classifyBucket(usdValue),
    binKey: getBinKey(price),
  };
}
