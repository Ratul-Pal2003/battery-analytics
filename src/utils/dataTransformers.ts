import type { CycleSnapshot, TemperatureSamplingRate } from '../types/battery';

/**
 * Transform temperature distribution data for D3.js visualization
 */
export interface TemperatureDataPoint {
  range: string;
  minutes: number;
  rangeStart: number;
  rangeEnd: number;
}

/**
 * Get temperature distribution data based on sampling rate
 */
export function getTemperatureDistribution(
  snapshot: CycleSnapshot,
  samplingRate: TemperatureSamplingRate
): TemperatureDataPoint[] {
  let distribution: Record<string, number>;

  switch (samplingRate) {
    case 5:
      distribution = snapshot.temperature_dist_5deg;
      break;
    case 10:
      distribution = snapshot.temperature_dist_10deg;
      break;
    case 15:
      distribution = snapshot.temperature_dist_15deg;
      break;
    case 20:
      distribution = snapshot.temperature_dist_20deg;
      break;
    default:
      distribution = snapshot.temperature_dist_10deg;
  }

  // Transform to array format for D3
  return Object.entries(distribution)
    .map(([range, minutes]) => {
      const [start, end] = range.split('-').map(Number);
      return {
        range,
        minutes,
        rangeStart: start,
        rangeEnd: end,
      };
    })
    .sort((a, b) => a.rangeStart - b.rangeStart);
}

/**
 * Get color based on temperature range
 */
export function getTemperatureColor(temp: number): string {
  if (temp < 10) return '#3b82f6'; // Blue - cold
  if (temp < 20) return '#10b981'; // Green - cool
  if (temp < 30) return '#f59e0b'; // Amber - warm
  if (temp < 40) return '#f97316'; // Orange - hot
  return '#ef4444'; // Red - very hot
}

/**
 * Format duration in hours to human-readable string
 */
export function formatDuration(hours: number): string {
  if (hours < 1) {
    return `${Math.round(hours * 60)} min`;
  }
  return `${hours.toFixed(1)} hrs`;
}

/**
 * Format date to relative time (e.g., "2 days ago")
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
}
