'use client';

import React from 'react';
import { useStore } from '@/store/useStore';

const StatusDot: React.FC = () => {
  const { wsStatus } = useStore();

  const getColor = () => {
    switch (wsStatus) {
      case 'connected':
        return 'bg-green-500';
      case 'connecting':
        return 'bg-yellow-500 animate-pulse';
      case 'disconnected':
        return 'bg-gray-500';
      case 'error':
        return 'bg-red-500 animate-pulse';
      default:
        return 'bg-gray-500';
    }
  };

  const getLabel = () => {
    switch (wsStatus) {
      case 'connected':
        return 'Live';
      case 'connecting':
        return 'Connecting...';
      case 'disconnected':
        return 'Disconnected';
      case 'error':
        return 'Error';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-3 h-3 rounded-full ${getColor()}`}
      />
      <span className="text-sm text-[var(--text-secondary)]">
        {getLabel()}
      </span>
    </div>
  );
};

export default StatusDot;
