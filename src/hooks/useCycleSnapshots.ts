import { useQuery } from '@tanstack/react-query';
import { batteryService } from '../services/api/batteryService';
import type { SnapshotsListResponse } from '../types/battery';
import type { SnapshotsQueryParams } from '../types/api';

/**
 * Custom hook to fetch cycle snapshots for a battery
 * Uses React Query for caching and automatic refetching
 */
export function useCycleSnapshots(params: SnapshotsQueryParams) {
  return useQuery<SnapshotsListResponse, Error>({
    queryKey: ['cycle-snapshots', params.imei, params.limit, params.offset],
    queryFn: () => batteryService.getSnapshots(params),
    enabled: !!params.imei, // Only run query if IMEI is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

export default useCycleSnapshots;
