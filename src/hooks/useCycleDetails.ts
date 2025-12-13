import { useQuery } from '@tanstack/react-query';
import { batteryService } from '../services/api/batteryService';
import type { CycleSnapshot } from '../types/battery';

/**
 * Custom hook to fetch detailed analytics for a specific cycle
 * Uses React Query for caching and automatic refetching
 */
export function useCycleDetails(imei: string | null, cycleNumber: number | null) {
  return useQuery<CycleSnapshot, Error>({
    queryKey: ['cycle-details', imei, cycleNumber],
    queryFn: () => batteryService.getCycleDetails(imei!, cycleNumber!),
    enabled: !!imei && !!cycleNumber, // Only run if both are provided
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

export default useCycleDetails;
