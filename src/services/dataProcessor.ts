import { BUCKETS, PRICE_BIN_SIZE } from '@/constants';
import { Trade } from '@/types';

interface TradeEvent {
  p: string;
  q: string;
  m: boolean;
  T: number;
}

export function classifyBucket(usdValue: number): keyof typeof BUCKETS {
  if (usdValue < BUCKETS.s100to1k.min) return 'allOrders';
  if (usdValue < BUCKETS.s1kto10k.min) return 's100to1k';
  if (usdValue < BUCKETS.s10kto100k.min) return 's1kto10k';
  if (usdValue < BUCKETS.s100kto1M.min) return 's10kto100k';
  if (usdValue < BUCKETS.s1Mto10M.min) return 's100kto1M';
  return 's1Mto10M';
}

export function getBinKey(price: number): number {
  return Math.floor(price / PRICE_BIN_SIZE) * PRICE_BIN_SIZE;
}

function isTradeEvent(msg: unknown): msg is TradeEvent {
  return (
    typeof msg === 'object' &&
    msg !== null &&
    'p' in msg &&
    'q' in msg &&
    'm' in msg &&
    'T' in msg
  );
}

export function processTrade(msg: unknown): Trade {
  if (!isTradeEvent(msg)) {
    throw new Error('Invalid trade payload');
  }

  const price = Number.parseFloat(msg.p);
  const qty = Number.parseFloat(msg.q);
  const usdValue = price * qty;
  const isBuy = !msg.m;
  const time = msg.T;

  if (!Number.isFinite(price) || !Number.isFinite(qty) || !Number.isFinite(usdValue)) {
    throw new Error('Invalid trade numeric values');
  }

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
