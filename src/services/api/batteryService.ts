import apiClient from './axios-config';
import { API_ENDPOINTS, DEFAULT_LIMIT, DEFAULT_OFFSET } from '../../utils/constants';
import type { BatterySummary, CycleSnapshot, SnapshotsListResponse, SnapshotsApiResponse, SummaryResponse } from '../../types/battery';
import type { SnapshotsQueryParams } from '../../types/api';
import { USE_MOCK_DATA, MOCK_BATTERY_SUMMARIES, generateMockCycleSnapshots } from '../../utils/mockData';

/**
 * Battery API Service
 * Contains all API call functions for battery data
 */

export const batteryService = {
  /**
   * Get summary of all accessible batteries
   * @param imei - Optional IMEI filter
   */
  getSummary: async (imei?: string): Promise<BatterySummary[]> => {
    if (USE_MOCK_DATA) {
      // Return mock data
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
      return imei
        ? MOCK_BATTERY_SUMMARIES.filter(b => b.imei === imei)
        : MOCK_BATTERY_SUMMARIES;
    }

    const params = imei ? { imei } : {};
    const response = await apiClient.get<SummaryResponse>(API_ENDPOINTS.SUMMARY, { params });
    return response.data.summary; // Extract summary array from wrapped response
  },

  /**
   * Get list of cycle snapshots for a specific battery
   * @param params - Query parameters (imei required, limit and offset optional)
   */
  getSnapshots: async (params: SnapshotsQueryParams): Promise<SnapshotsListResponse> => {
    const { imei, limit = DEFAULT_LIMIT, offset = DEFAULT_OFFSET } = params;

    if (USE_MOCK_DATA) {
      // Return mock data
      await new Promise(resolve => setTimeout(resolve, 400)); // Simulate network delay
      const allSnapshots = generateMockCycleSnapshots(imei);
      const paginatedSnapshots = allSnapshots.slice(offset, offset + limit);

      return {
        snapshots: paginatedSnapshots,
        total: allSnapshots.length,
        limit,
        offset,
      };
    }

    const response = await apiClient.get<SnapshotsApiResponse>(API_ENDPOINTS.SNAPSHOTS, {
      params: { imei, limit, offset },
    });

    // Map API response to internal format
    return {
      snapshots: response.data.data,
      total: response.data.count,
      limit: response.data.filters.limit,
      offset: response.data.filters.offset,
    };
  },

  /**
   * Get the most recent cycle snapshot for a battery
   * @param imei - Battery IMEI
   */
  getLatestSnapshot: async (imei: string): Promise<CycleSnapshot> => {
    if (USE_MOCK_DATA) {
      // Return mock data
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
      const snapshots = generateMockCycleSnapshots(imei);
      return snapshots[snapshots.length - 1];
    }

    const response = await apiClient.get<{ success: boolean; data: any }>(API_ENDPOINTS.LATEST(imei));
    const cycleData = response.data.data;

    // Parse alert_details if it's a string
    if (typeof cycleData.alert_details === 'string') {
      try {
        cycleData.alert_details = JSON.parse(cycleData.alert_details);
      } catch (e) {
        cycleData.alert_details = { warnings: [], protections: [] };
      }
    }

    return cycleData;
  },

  /**
   * Get detailed analytics for a specific cycle
   * @param imei - Battery IMEI
   * @param cycleNumber - Cycle number
   */
  getCycleDetails: async (imei: string, cycleNumber: number): Promise<CycleSnapshot> => {
    if (USE_MOCK_DATA) {
      // Return mock data
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
      const snapshots = generateMockCycleSnapshots(imei);
      const cycle = snapshots.find(s => s.cycle_number === cycleNumber);
      if (!cycle) {
        throw new Error(`Cycle ${cycleNumber} not found`);
      }
      return cycle;
    }

    const response = await apiClient.get<{ success: boolean; data: any }>(
      API_ENDPOINTS.CYCLE_DETAILS(imei, cycleNumber)
    );
    const cycleData = response.data.data;

    // Parse alert_details if it's a string
    if (typeof cycleData.alert_details === 'string') {
      try {
        cycleData.alert_details = JSON.parse(cycleData.alert_details);
      } catch (e) {
        cycleData.alert_details = { warnings: [], protections: [] };
      }
    }

    return cycleData;
  },
};

export default batteryService;
