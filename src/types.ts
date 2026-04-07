import { BUCKETS, TIMEFRAMES, VIEW_MODES, SYMBOLS } from './constants';

export interface Trade {
  price: number;
  qty: number;
  usdValue: number;
  isBuy: boolean;
  time: number;
  bucket: keyof typeof BUCKETS;
  binKey: number;
}

export interface HeatmapBin {
  volume: number;
  cvd: number;
  buyVolume: number;
  sellVolume: number;
}

export interface CVDPoint {
  time: number;
  value: number;
}

export interface KlineData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TickerData {
  symbol: string;
  priceChange: number;
  priceChangePercent: number;
  quoteAssetVolume: number;
}

export type Timeframe = typeof TIMEFRAMES[number];
export type ViewMode = typeof VIEW_MODES[number];
export type TickerSymbol = typeof SYMBOLS[number];

export interface StoreState {
  heatmapBins: Map<number, HeatmapBin>;
  cvdSeries: Record<keyof typeof BUCKETS, CVDPoint[]>;
  currentPrice: number;
  priceHistory: KlineData[];
  timeframe: Timeframe;
  viewMode: ViewMode;
  activeSymbol: TickerSymbol;
  wsStatus: 'connected' | 'connecting' | 'disconnected' | 'error';
  tradesPerSecond: number;
  totalVolume24h: number;
  priceChange24h: number;
  dominantFlow: 'buy' | 'sell' | 'neutral';

  addTrade: (trade: Trade) => void;
  setTimeframe: (tf: Timeframe) => void;
  setViewMode: (mode: ViewMode) => void;
  setSymbol: (symbol: TickerSymbol) => void;
  setWsStatus: (status: StoreState['wsStatus']) => void;
  updateMetrics: (volume: number, change: number, flow: 'buy' | 'sell' | 'neutral') => void;
  clearData: () => void;
  setTradesPerSecond: (tps: number) => void;
  setPriceHistory: (history: KlineData[]) => void;
}
