'use client';

import React from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  color?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  unit = '',
  icon,
  color = 'text-[var(--text-primary)]',
}) => {
  return (
    <div className="bg-[#0d1117] rounded-lg p-4 border border-[var(--border-subtle)]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase text-[var(--text-tertiary)] font-medium mb-2 tracking-wider">
            {label}
          </p>
          <p className={`font-mono text-lg font-medium ${color}`}>
            {value}
            {unit && <span className="text-sm ml-1">{unit}</span>}
          </p>
        </div>
        {icon && (
          <div className="text-[var(--text-secondary)]">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;
