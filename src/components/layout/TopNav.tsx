'use client';

import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { SYMBOLS } from '@/constants';
import { Symbol } from '@/types';
import { binanceWSService } from '@/services/binanceWS';
import StatusDot from '@/components/ui/StatusDot';
import PriceFlash from '@/components/ui/PriceFlash';
import { Moon, Sun } from 'lucide-react';

const TopNav: React.FC = () => {
  const { activeSymbol, setSymbol, currentPrice, priceChange24h } = useStore();
  const [isDark, setIsDark] = useState(true);

  const handleSymbolChange = (symbol: Symbol) => {
    setSymbol(symbol);
    binanceWSService.disconnect();
    binanceWSService.connect(symbol);
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (isDark) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  return (
    <div className="w-full bg-[#080c0f] border-b border-[var(--border-subtle)] px-6 py-4">
      <div className="flex items-center justify-between gap-8">
        {/* Logo */}
        <div className="flex items-center gap-3 min-w-fit">
          <div className="w-8 h-8 bg-[var(--accent-teal)] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">CF</span>
          </div>
          <h1 className="text-xl font-bold text-white">CryptoFlow</h1>
        </div>

        {/* Symbol Selector */}
        <div className="flex gap-2">
          {SYMBOLS.map((symbol) => (
            <button
              key={symbol}
              onClick={() => handleSymbolChange(symbol)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeSymbol === symbol
                  ? 'bg-[var(--accent-teal)] text-white'
                  : 'bg-[#0d1117] text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:border-[var(--border-default)]'
              }`}
            >
              {symbol.replace('USDT', '')}
            </button>
          ))}
        </div>

        {/* Price Info */}
        <div className="flex-1 flex items-center gap-6 ml-auto">
          <div>
            <p className="text-xs uppercase text-[var(--text-tertiary)] mb-1 font-medium">
              Price
            </p>
            <PriceFlash
              value={currentPrice}
              className="text-2xl text-white"
            />
          </div>

          <div>
            <p className="text-xs uppercase text-[var(--text-tertiary)] mb-1 font-medium">
              24h Change
            </p>
            <span
              className={`font-mono text-lg font-medium ${
                priceChange24h >= 0 ? 'text-[var(--buy-color)]' : 'text-[var(--sell-color)]'
              }`}
            >
              {priceChange24h >= 0 ? '+' : ''}
              {priceChange24h.toFixed(2)}%
            </span>
          </div>

          <StatusDot />
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-[#0d1117] border border-[var(--border-subtle)] hover:border-[var(--border-default)] transition-all"
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-[var(--text-secondary)]" />
          ) : (
            <Moon className="w-4 h-4 text-[var(--text-secondary)]" />
          )}
        </button>
      </div>
    </div>
  );
};

export default TopNav;
