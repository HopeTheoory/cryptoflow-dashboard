import { CVDPoint } from '@/types';
import { MAX_CVD_POINTS } from '@/constants';

export function updateCVD(
  series: CVDPoint[],
  time: number,
  volumeChange: number,
  normalize: boolean = false
): CVDPoint[] {
  const lastValue = series.length > 0 ? series[series.length - 1].value : 0;
  const newValue = lastValue + volumeChange;

  const newPoint: CVDPoint = {
    time,
    value: normalize ? normalizeValue(newValue) : newValue,
  };

  const updated = [...series, newPoint];

  if (updated.length > MAX_CVD_POINTS) {
    return updated.slice(-MAX_CVD_POINTS);
  }

  return updated;
}

export function normalizeSeries(series: CVDPoint[]): CVDPoint[] {
  if (series.length === 0) return [];

  const maxAbsValue = Math.max(
    ...series.map((p) => Math.abs(p.value))
  );

  if (maxAbsValue === 0) return series;

  return series.map((point) => ({
    ...point,
    value: (point.value / maxAbsValue) * 100,
  }));
}

export function normalizeValue(value: number): number {
  const maxVal = 1000000;
  const normalized = Math.max(-100, Math.min(100, (value / maxVal) * 100));
  return normalized;
}
