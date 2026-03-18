'use client';

import React from 'react';
import { useStore } from '@/store/useStore';
import MetricCard from '@/components/ui/MetricCard';
import {
  BarChart3,
  TrendingUp,
  Settings,
  LogOut,
  Zap,
  Activity,
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const { totalVolume24h, tradesPerSecond, dominantFlow } = useStore();

  const navigationItems = [
    { label: 'Dashboard', icon: BarChart3, active: true },
    { label: 'Analysis', icon: TrendingUp, active: false },
    { label: 'Orders', icon: Activity, active: false },
    { label: 'Settings', icon: Settings, active: false },
  ];

  const formatVolume = (volume: number) => {
    if (volume >= 1e9) return `$${(volume / 1e9).toFixed(1)}B`;
    if (volume >= 1e6) return `$${(volume / 1e6).toFixed(1)}M`;
    if (volume >= 1e3) return `$${(volume / 1e3).toFixed(1)}K`;
    return `$${volume.toFixed(0)}`;
  };

  const getFlowColor = () => {
    switch (dominantFlow) {
      case 'buy':
        return 'text-[var(--buy-color)]';
      case 'sell':
        return 'text-[var(--sell-color)]';
      default:
        return 'text-[var(--text-secondary)]';
    }
  };

  return (
    <div className="w-64 bg-[#0d1117] border-r border-[var(--border-subtle)] flex flex-col h-full overflow-y-auto">
      {/* User Section */}
      <div className="p-4 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-[var(--accent-teal)] flex items-center justify-center">
            <span className="text-white font-bold text-sm">FI</span>
          </div>
          <div>
            <p className="text-sm font-medium text-white">Fahad Ibrahim</p>
            <p className="text-xs text-[var(--text-tertiary)]">Connected</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex-1 px-3 py-2 rounded-md text-xs font-medium bg-[#141b22] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-default)] transition-all">
            Profile
          </button>
          <button className="flex-1 px-3 py-2 rounded-md text-xs font-medium bg-[#141b22] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-default)] transition-all">
            Sign Out
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="p-4 border-b border-[var(--border-subtle)]">
        <p className="text-10px uppercase text-[var(--text-tertiary)] font-bold mb-3 tracking-wider">
          Dashboard
        </p>
        {navigationItems.map((item) => (
          <button
            key={item.label}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all mb-2 ${
              item.active
                ? 'bg-[#1c2433] text-[var(--accent-teal)] border-l-3 border-[var(--accent-teal)]'
                : 'text-[var(--text-secondary)] hover:bg-[#141b22]'
            }`}
          >
            <item.icon className="w-4 h-4" />
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Metrics Cards */}
      <div className="p-4 flex-1 space-y-3">
        <MetricCard
          label="24h Volume"
          value={formatVolume(totalVolume24h)}
          color="text-[var(--text-primary)]"
        />

        <MetricCard
          label="Trades/sec"
          value={tradesPerSecond.toFixed(1)}
          unit="TPS"
          color="text-[var(--text-primary)]"
        />

        <MetricCard
          label="Dominant Flow"
          value={dominantFlow.toUpperCase()}
          color={getFlowColor()}
          icon={<Zap className="w-4 h-4" />}
        />

        <MetricCard
          label="Status"
          value="Live"
          color="text-[var(--buy-color)]"
        />
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-[var(--border-subtle)] flex gap-2">
        <button className="flex-1 px-3 py-2 rounded-md text-xs font-medium bg-[#141b22] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-default)] transition-all flex items-center gap-2 justify-center">
          <Settings className="w-3 h-3" />
          Settings
        </button>
        <button className="flex-1 px-3 py-2 rounded-md text-xs font-medium bg-[#141b22] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-default)] transition-all flex items-center gap-2 justify-center">
          <LogOut className="w-3 h-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
