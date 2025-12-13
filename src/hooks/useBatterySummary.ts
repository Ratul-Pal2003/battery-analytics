import { useQuery } from '@tanstack/react-query';
import { batteryService } from '../services/api/batteryService';
import type { BatterySummary } from '../types/battery';

/**
 * Custom hook to fetch battery summary data
 * Uses React Query for caching and automatic refetching
 */
export function useBatterySummary(imei?: string) {
  return useQuery<BatterySummary[], Error>({
    queryKey: ['battery-summary', imei],
    queryFn: () => batteryService.getSummary(imei),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
}

export default useBatterySummary;
