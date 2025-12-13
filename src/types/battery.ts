// TypeScript types for battery data structures

export interface BatterySummary {
  imei: string;
  total_cycles: number;
  first_cycle: number;
  last_cycle: number;
  avg_soc_across_cycles: number;
  avg_soh_across_cycles: number;
  avg_temp_across_cycles: number;
  total_distance_all_cycles: number;
  total_charging_instances: number;
  first_cycle_time: string;
  last_cycle_time: string;
}

// API response wrapper for summary endpoint
export interface SummaryResponse {
  success: boolean;
  summary: BatterySummary[];
  total_batteries: number;
}

export interface AlertDetails {
  warnings: string[];
  protections: string[];
}

export interface CycleSnapshot {
  imei: string;
  cycle_number: number;
  cycle_start_time: string;
  cycle_end_time: string;
  cycle_duration_hours: number;
  data_points_count: number;

  // Battery Health
  soh_drop: number;
  average_soc: number;
  min_soc: number;
  max_soc: number;
  average_soh: number;
  min_soh: number;
  max_soh: number;

  // Temperature
  average_temperature: number;
  temperature_dist_5deg: Record<string, number>;
  temperature_dist_10deg: Record<string, number>;
  temperature_dist_15deg: Record<string, number>;
  temperature_dist_20deg: Record<string, number>;

  // Performance
  total_distance: number;
  average_speed: number;
  max_speed: number;

  // Charging
  charging_instances_count: number;
  average_charge_start_soc: number;

  // Voltage
  voltage_avg: number;
  voltage_min: number;
  voltage_max: number;
  current_avg: number;

  // Safety
  alert_details: AlertDetails;
  warning_count: number;
  protection_count: number;

  // Metadata
  created_at: string;
}

// API response from server for snapshots endpoint
export interface SnapshotsApiResponse {
  success: boolean;
  data: CycleSnapshot[];
  count: number;
  filters: {
    imei: string;
    cycle_number: number | null;
    limit: number;
    offset: number;
  };
}

// Internal interface used by the app (for backward compatibility)
export interface SnapshotsListResponse {
  snapshots: CycleSnapshot[];
  total: number;
  limit: number;
  offset: number;
}

export type TemperatureSamplingRate = 5 | 10 | 15 | 20;

export interface TemperatureDistribution {
  samplingRate: TemperatureSamplingRate;
  distribution: Record<string, number>;
}
