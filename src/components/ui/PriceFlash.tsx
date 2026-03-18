'use client';

import React, { useEffect, useState } from 'react';

interface PriceFlashProps {
  value: number;
  className?: string;
}

const PriceFlash: React.FC<PriceFlashProps> = ({ value, className = '' }) => {
  const [isFlashing, setIsFlashing] = useState(false);

  useEffect(() => {
    setIsFlashing(true);
    const timer = setTimeout(() => setIsFlashing(false), 500);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <span
      className={`font-mono font-medium transition-colors ${
        isFlashing ? 'animate-flash' : ''
      } ${className}`}
    >
      ${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    </span>
  );
};

export default PriceFlash;
