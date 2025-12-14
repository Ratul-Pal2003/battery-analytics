/**
 * Utility functions for safe number formatting
 */

/**
 * Safely formats a number with toFixed, handling null/undefined/NaN
 */
export function safeToFixed(value: number | null | undefined, decimals: number = 2): string {
  if (value === null || value === undefined || isNaN(value) || !isFinite(value)) {
    return '0.' + '0'.repeat(decimals);
  }
  return value.toFixed(decimals);
}

/**
 * Safely formats a number, returning a fallback if invalid
 */
export function safeNumber(value: number | null | undefined, fallback: number = 0): number {
  if (value === null || value === undefined || isNaN(value) || !isFinite(value)) {
    return fallback;
  }
  return value;
}
