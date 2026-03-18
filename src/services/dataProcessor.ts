import { BUCKETS, PRICE_BIN_SIZE } from '@/constants';
import { Trade } from '@/types';

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

export function processTrade(msg: any): Trade {
  const price = parseFloat(msg.p);
  const qty = parseFloat(msg.q);
  const usdValue = price * qty;
  const isBuy = !msg.m;
  const time = msg.T;

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
