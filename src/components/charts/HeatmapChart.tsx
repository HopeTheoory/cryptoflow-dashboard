'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useStore } from '@/store/useStore';
import chroma from 'chroma-js';
import { PRICE_BIN_SIZE, MAX_BINS } from '@/constants';

const HeatmapChart: React.FC<{ width: number; height: number }> = ({
  width,
  height,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { heatmapBins, currentPrice } = useStore();
  const [dimensions, setDimensions] = useState({ width, height });
  const animationFrameRef = useRef<number>();
  const lastRenderRef = useRef<number>(0);

  const colorScale = useMemo(
    () =>
      chroma.scale([
        '#0d0208',
        '#3d0010',
        '#8b0000',
        '#cc3300',
        '#ff6600',
        '#ffaa00',
        '#ffff00',
        '#ffffff',
      ]),
    []
  );

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver(() => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const getBinArray = useMemo(() => {
    if (heatmapBins.size === 0) return [];
    const sorted = Array.from(heatmapBins.entries())
      .sort((a, b) => a[0] - b[0])
      .slice(-MAX_BINS);
    return sorted;
  }, [heatmapBins]);

  const priceRange = useMemo(() => {
    if (getBinArray.length === 0) return { min: 0, max: 100000 };
    const prices = getBinArray.map(([price]) => price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const padding = (max - min) * 0.1 || 5000;
    return {
      min: Math.max(0, min - padding),
      max: max + padding,
    };
  }, [getBinArray]);

  const render = () => {
    const now = performance.now();
    if (now - lastRenderRef.current < 1000 / 10) {
      animationFrameRef.current = requestAnimationFrame(render);
      return;
    }
    lastRenderRef.current = now;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    ctx.fillStyle = '#0a0e12';
    ctx.fillRect(0, 0, dimensions.width, dimensions.height);

    if (getBinArray.length === 0) {
      ctx.fillStyle = 'rgba(139, 158, 176, 0.3)';
      ctx.font = '14px var(--font-geist-sans)';
      ctx.textAlign = 'center';
      ctx.fillText('Waiting for data...', dimensions.width / 2, dimensions.height / 2);
      return;
    }

    const binWidth = dimensions.width / getBinArray.length;
    const pricePixelRatio = dimensions.height / (priceRange.max - priceRange.min);

    const maxVolume = Math.max(
      ...getBinArray.map(([, bin]) => bin.volume),
      1
    );

    getBinArray.forEach(([price, bin], index) => {
      const x = index * binWidth;
      const y = dimensions.height - (price - priceRange.min) * pricePixelRatio;
      const height = PRICE_BIN_SIZE * pricePixelRatio;

      const normalized = bin.volume / maxVolume;
      const color = colorScale(normalized);
      ctx.fillStyle = color.hex();
      ctx.fillRect(x, Math.max(0, y - height), binWidth, height);

      if (bin.volume > 0 && normalized > 0.5) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, Math.max(0, y - height), binWidth, height);
      }
    });

    // Draw price level lines
    ctx.strokeStyle = 'rgba(139, 158, 176, 0.15)';
    ctx.lineWidth = 1;
    const step = 1000;
    for (let price = Math.ceil(priceRange.min / step) * step; price <= priceRange.max; price += step) {
      const y = dimensions.height - (price - priceRange.min) * pricePixelRatio;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(dimensions.width, y);
      ctx.stroke();
    }

    // Draw current price line
    if (currentPrice > 0) {
      const y = dimensions.height - (currentPrice - priceRange.min) * pricePixelRatio;
      ctx.strokeStyle = '#14b8a6';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(dimensions.width, y);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw Y-axis labels (prices on right)
    ctx.fillStyle = '#8b9eb0';
    ctx.font = '11px "JetBrains Mono"';
    ctx.textAlign = 'right';
    for (let price = Math.ceil(priceRange.min / step) * step; price <= priceRange.max; price += step) {
      const y = dimensions.height - (price - priceRange.min) * pricePixelRatio;
      ctx.fillText(`$${(price / 1000).toFixed(0)}k`, dimensions.width - 5, y + 4);
    }

    animationFrameRef.current = requestAnimationFrame(render);
  };

  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(render);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [dimensions, getBinArray, priceRange, currentPrice, colorScale]);

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-[#0a0e12] border-b border-[var(--border-subtle)] overflow-hidden"
      style={{ height: `${height}px` }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
};

export default HeatmapChart;
