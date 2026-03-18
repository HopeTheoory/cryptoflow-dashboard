'use client';

import React, { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import { binanceWSService } from '@/services/binanceWS';
import { fetchKlines, fetch24hTicker } from '@/services/historicalFetch';
import TopNav from '@/components/layout/TopNav';
import Sidebar from '@/components/layout/Sidebar';
import TimeframeSelector from '@/components/ui/TimeframeSelector';
import HeatmapChart from '@/components/charts/HeatmapChart';
import PriceChart from '@/components/charts/PriceChart';
import CVDPanel from '@/components/charts/CVDPanel';
import CVDLegend from '@/components/charts/CVDLegend';

export default function Dashboard() {
  const {
    activeSymbol,
    setPriceHistory,
    updateMetrics,
    setWsStatus,
  } = useStore();

  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // Initialize historical data and WebSocket
  useEffect(() => {
    const initializeData = async () => {
      try {
        setWsStatus('connecting');

        // Fetch historical klines
        const klines = await fetchKlines(activeSymbol, '1m', 500);
        if (klines.length > 0) {
          setPriceHistory(klines);
        }

        // Fetch 24h ticker data
        const ticker = await fetch24hTicker(activeSymbol);
        if (ticker) {
          updateMetrics(
            ticker.quoteAssetVolume,
            ticker.priceChangePercent,
            ticker.priceChangePercent >= 0 ? 'buy' : 'sell'
          );
        }

        // Connect WebSocket
        binanceWSService.connect(activeSymbol);
      } catch (err) {
        console.error('Failed to initialize data:', err);
        setWsStatus('error');
      }
    };

    initializeData();

    return () => {
      binanceWSService.disconnect();
    };
  }, [activeSymbol, setPriceHistory, updateMetrics, setWsStatus]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const heatmapHeight = Math.floor((windowSize.height * 0.6) - 100);
  const cvdHeight = Math.floor((windowSize.height * 0.35) - 100);
  const chartWidth = windowSize.width - 256;

  if (windowSize.width === 0) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-[#080c0f]">
        <div className="text-[var(--text-secondary)]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-screen bg-[#080c0f] overflow-hidden">
      {/* Top Navigation */}
      <TopNav />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Charts Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Timeframe Selector */}
          <TimeframeSelector />

          {/* Heatmap Chart with Price Overlay */}
          <div className="relative flex-1 overflow-hidden">
            <HeatmapChart width={chartWidth} height={heatmapHeight} />
            <div className="absolute inset-0">
              <PriceChart width={chartWidth} height={heatmapHeight} />
            </div>
          </div>

          {/* CVD Panel */}
          <CVDPanel width={chartWidth} height={cvdHeight} />

          {/* CVD Legend */}
          <CVDLegend />
        </div>
      </div>
    </div>
  );
}
