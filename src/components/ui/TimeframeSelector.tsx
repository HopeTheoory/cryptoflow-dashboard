'use client';

import React from 'react';
import { useStore } from '@/store/useStore';
import { TIMEFRAMES, VIEW_MODES } from '@/constants';
import { Timeframe, ViewMode } from '@/types';

const TimeframeSelector: React.FC = () => {
  const { timeframe, viewMode, setTimeframe, setViewMode } = useStore();

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-[#0d1117] border-b border-[var(--border-subtle)]">
      <div className="flex gap-2">
        {TIMEFRAMES.map((tf) => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf as Timeframe)}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
              timeframe === tf
                ? 'bg-[var(--accent-teal)] text-white'
                : 'bg-transparent text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:border-[var(--border-default)]'
            }`}
          >
            {tf}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        {VIEW_MODES.map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode as ViewMode)}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
              viewMode === mode
                ? 'bg-[var(--accent-teal)] text-white'
                : 'bg-transparent text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:border-[var(--border-default)]'
            }`}
          >
            {mode}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TimeframeSelector;
