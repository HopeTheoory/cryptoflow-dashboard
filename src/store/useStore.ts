import { create } from 'zustand';
import { StoreState, Trade, HeatmapBin } from '@/types';
import { MAX_CVD_POINTS } from '@/constants';

export const useStore = create<StoreState>((set) => ({
  heatmapBins: new Map<number, HeatmapBin>(),
  cvdSeries: {
    allOrders: [],
    s100to1k: [],
    s1kto10k: [],
    s10kto100k: [],
    s100kto1M: [],
    s1Mto10M: [],
  },
  currentPrice: 0,
  priceHistory: [],
  timeframe: '1D',
  viewMode: 'Normalized CVD',
  activeSymbol: 'BTCUSDT',
  wsStatus: 'disconnected',
  tradesPerSecond: 0,
  totalVolume24h: 0,
  priceChange24h: 0,
  dominantFlow: 'neutral',

  addTrade: (trade: Trade) =>
    set((state) => {
      const newBins = new Map(state.heatmapBins);
      const binKey = trade.binKey;
      const existingBin = newBins.get(binKey) || {
        volume: 0,
        cvd: 0,
        buyVolume: 0,
        sellVolume: 0,
      };

      const volumeChange = trade.isBuy ? trade.usdValue : -trade.usdValue;

      existingBin.volume += trade.usdValue;
      existingBin.cvd += volumeChange;
      existingBin.buyVolume += trade.isBuy ? trade.usdValue : 0;
      existingBin.sellVolume += !trade.isBuy ? trade.usdValue : 0;

      newBins.set(binKey, existingBin);

      const newCvdSeries = { ...state.cvdSeries };
      const bucket = trade.bucket;
      const currentCVD =
        newCvdSeries[bucket].length > 0
          ? newCvdSeries[bucket][newCvdSeries[bucket].length - 1].value
          : 0;

      const newValue = currentCVD + (trade.isBuy ? trade.usdValue : -trade.usdValue);
      newCvdSeries[bucket] = [
        ...newCvdSeries[bucket],
        { time: trade.time, value: newValue },
      ];

      if (newCvdSeries[bucket].length > MAX_CVD_POINTS) {
        newCvdSeries[bucket] = newCvdSeries[bucket].slice(-MAX_CVD_POINTS);
      }

      return {
        heatmapBins: newBins,
        cvdSeries: newCvdSeries,
        currentPrice: trade.price,
      };
    }),

  setTimeframe: (tf) => set({ timeframe: tf }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setSymbol: (symbol) => set({ activeSymbol: symbol }),
  setWsStatus: (status) => set({ wsStatus: status }),

  updateMetrics: (volume, change, flow) =>
    set({
      totalVolume24h: volume,
      priceChange24h: change,
      dominantFlow: flow,
    }),

  clearData: () =>
    set({
      heatmapBins: new Map<number, HeatmapBin>(),
      cvdSeries: {
        allOrders: [],
        s100to1k: [],
        s1kto10k: [],
        s10kto100k: [],
        s100kto1M: [],
        s1Mto10M: [],
      },
      currentPrice: 0,
      priceHistory: [],
      tradesPerSecond: 0,
    }),

  setTradesPerSecond: (tps) => set({ tradesPerSecond: tps }),
  setPriceHistory: (history) => set({ priceHistory: history }),
}));
