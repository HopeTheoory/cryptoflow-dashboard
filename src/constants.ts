export const PRICE_BIN_SIZE = 50;
export const MAX_BINS = 500;
export const MAX_CVD_POINTS = 2000;
export const HEATMAP_FPS = 10;
export const CVD_UPDATE_HZ = 1;

export const BUCKETS = {
  allOrders: {
    label: 'All Orders',
    color: '#3b82f6',
    min: 0,
    max: Infinity,
  },
  s100to1k: {
    label: '$100 to $1k',
    color: '#f97316',
    min: 100,
    max: 1000,
  },
  s1kto10k: {
    label: '$1k to $10k',
    color: '#22c55e',
    min: 1000,
    max: 10000,
  },
  s10kto100k: {
    label: '$10k to $100k',
    color: '#ef4444',
    min: 10000,
    max: 100000,
  },
  s100kto1M: {
    label: '$100k to $1M',
    color: '#a855f7',
    min: 100000,
    max: 1000000,
  },
  s1Mto10M: {
    label: '$1M to $10M',
    color: '#eab308',
    min: 1000000,
    max: 10000000,
  },
} as const;

export const TIMEFRAMES = ['1D', '1W', '1M', '6M', '1Y', '3Y'] as const;
export const VIEW_MODES = ['Normalized CVD', 'Absolute CVD'] as const;
export const SYMBOLS = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT'] as const;
