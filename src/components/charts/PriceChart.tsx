'use client';

import React, { useEffect, useRef } from 'react';
import { useStore } from '@/store/useStore';
import {
  createChart,
  IChartApi,
  ISeriesApi,
  LineSeriesPartialOptions,
  Time,
} from 'lightweight-charts';

const PriceChart: React.FC<{ width: number; height: number }> = ({
  width,
  height,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  const { priceHistory } = useStore();

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = '';

    const chart = createChart(containerRef.current, {
      layout: {
        background: { color: 'transparent' },
        textColor: '#8b9eb0',
        fontSize: 11,
      },
      width,
      height,
      timeScale: {
        visible: false,
      },
      rightPriceScale: {
        visible: false,
      },
      leftPriceScale: {
        visible: false,
      },
    });

    chartRef.current = chart;

    const lineSeries = chart.addLineSeries({
      color: '#e2e8f0',
      lineWidth: 2,
    } as LineSeriesPartialOptions);

    seriesRef.current = lineSeries;

    if (priceHistory.length > 0) {
      const data = priceHistory.map((kline) => ({
        time: Math.floor(kline.time / 1000) as Time,
        value: kline.close,
      }));
      lineSeries.setData(data);
    }

    chart.timeScale().fitContent();

    const handleResize = () => {
      if (containerRef.current && chartRef.current) {
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        chartRef.current.applyOptions({ width, height });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, [width, height]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (seriesRef.current && priceHistory.length > 0) {
      const data = priceHistory.map((kline) => ({
        time: Math.floor(kline.time / 1000) as Time,
        value: kline.close,
      }));
      seriesRef.current.setData(data);
      chartRef.current?.timeScale().fitContent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priceHistory.length]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full"
      style={{ height: `${height}px` }}
    />
  );
};

export default PriceChart;
