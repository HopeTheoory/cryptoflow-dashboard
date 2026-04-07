'use client';

import React, { useEffect, useRef } from 'react';
import { useStore } from '@/store/useStore';
import {
  createChart,
  IChartApi,
  LineSeriesPartialOptions,
  Time,
} from 'lightweight-charts';
import { BUCKETS } from '@/constants';

const CVDPanel: React.FC<{ width: number; height: number }> = ({
  width,
  height,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const { cvdSeries, viewMode } = useStore();

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = '';

    const chart = createChart(containerRef.current, {
      layout: {
        background: { color: '#0a0e12' },
        textColor: '#8b9eb0',
        fontSize: 11,
      },
      width,
      height,
      timeScale: {
        visible: true,
        timeVisible: true,
      },
      rightPriceScale: {
        visible: true,
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
      },
    });

    chartRef.current = chart;

    Object.entries(BUCKETS).forEach(([key, bucket]) => {
      const series = chart.addLineSeries({
        color: bucket.color,
        lineWidth: 2,
      } as LineSeriesPartialOptions);

      const data = cvdSeries[key as keyof typeof BUCKETS].map((point) => ({
        time: Math.floor(point.time / 1000) as Time,
        value: point.value,
      }));

      if (data.length > 0) {
        series.setData(data);
      }
    });

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
    if (!chartRef.current) return;

    const chart = chartRef.current;
    chart.timeScale().fitContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode]);

  return (
    <div
      ref={containerRef}
      className="w-full bg-[#0a0e12] border-t border-[var(--border-subtle)]"
      style={{ height: `${height}px` }}
    />
  );
};

export default CVDPanel;
