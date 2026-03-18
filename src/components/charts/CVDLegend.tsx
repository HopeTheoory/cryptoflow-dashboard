'use client';

import React from 'react';
import { BUCKETS } from '@/constants';

const CVDLegend: React.FC = () => {
  const bucketEntries = Object.entries(BUCKETS);

  return (
    <div className="w-full bg-[#0d1117] px-6 py-3 border-t border-[var(--border-subtle)]">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {bucketEntries.map(([key, bucket]) => (
          <div key={key} className="flex items-center gap-3">
            <div
              className="w-4 h-1 rounded-full"
              style={{ backgroundColor: bucket.color }}
            />
            <span className="text-11px text-[var(--text-secondary)] font-medium">
              {bucket.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CVDLegend;
