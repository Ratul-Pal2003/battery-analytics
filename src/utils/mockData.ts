import type { BatterySummary, CycleSnapshot } from '../types/battery';

/**
 * Mock data for development/testing when API is unavailable
 */

export const MOCK_BATTERY_SUMMARIES: BatterySummary[] = [
  {
    imei: '865044073967657',
    total_cycles: 45,
    first_cycle: 0,
    last_cycle: 45,
    avg_soc_across_cycles: 74.2,
    avg_soh_across_cycles: 87.5,
    avg_temp_across_cycles: 28.5,
    total_distance_all_cycles: 1250.0,
    total_charging_instances: 120,
    first_cycle_time: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    last_cycle_time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    imei: '865044073949366',
    total_cycles: 38,
    first_cycle: 0,
    last_cycle: 38,
    avg_soc_across_cycles: 68.3,
    avg_soh_across_cycles: 91.2,
    avg_temp_across_cycles: 26.8,
    total_distance_all_cycles: 980.0,
    total_charging_instances: 95,
    first_cycle_time: new Date(Date.now() - 38 * 24 * 60 * 60 * 1000).toISOString(),
    last_cycle_time: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const generateMockCycleSnapshots = (imei: string, count: number = 45): CycleSnapshot[] => {
  const snapshots: CycleSnapshot[] = [];
  const baseDate = new Date('2024-01-01');

  for (let i = 1; i <= count; i++) {
    const cycleStart = new Date(baseDate.getTime() + (i - 1) * 24 * 60 * 60 * 1000);
    const duration = 3 + Math.random() * 2; // 3-5 hours
    const cycleEnd = new Date(cycleStart.getTime() + duration * 60 * 60 * 1000);

    snapshots.push({
      imei,
      cycle_number: i,
      cycle_start_time: cycleStart.toISOString(),
      cycle_end_time: cycleEnd.toISOString(),
      cycle_duration_hours: duration,
      data_points_count: Math.floor(500 + Math.random() * 1000),

      // Battery Health
      soh_drop: 0.1 + Math.random() * 0.3,
      average_soc: 45 + Math.random() * 40,
      min_soc: 15 + Math.random() * 10,
      max_soc: 85 + Math.random() * 10,
      average_soh: 95 + Math.random() * 5,
      min_soh: 94 + Math.random() * 3,
      max_soh: 98 + Math.random() * 2,

      // Temperature
      average_temperature: 25 + Math.random() * 15,
      temperature_dist_5deg: generateTempDistribution(5),
      temperature_dist_10deg: generateTempDistribution(10),
      temperature_dist_15deg: generateTempDistribution(15),
      temperature_dist_20deg: generateTempDistribution(20),

      // Performance
      total_distance: 25 + Math.random() * 50,
      average_speed: 20 + Math.random() * 30,
      max_speed: 45 + Math.random() * 35,

      // Charging
      charging_instances_count: Math.floor(1 + Math.random() * 3),
      average_charge_start_soc: 15 + Math.random() * 20,

      // Voltage
      voltage_avg: 48 + Math.random() * 6,
      voltage_min: 44 + Math.random() * 2,
      voltage_max: 52 + Math.random() * 2,
      current_avg: 8 + Math.random() * 6,

      // Safety
      alert_details: {
        warnings: Math.random() > 0.8 ? ['High Temperature Warning'] : [],
        protections: Math.random() > 0.9 ? ['Overcurrent Protection'] : [],
      },
      warning_count: Math.random() > 0.8 ? 1 : 0,
      protection_count: Math.random() > 0.9 ? 1 : 0,

      // Metadata
      created_at: new Date().toISOString(),
    });
  }

  return snapshots;
};

function generateTempDistribution(samplingRate: number): Record<string, number> {
  const distribution: Record<string, number> = {};
  const baseTemp = 15;
  const ranges = Math.floor(50 / samplingRate);

  for (let i = 0; i < ranges; i++) {
    const start = baseTemp + i * samplingRate;
    const end = start + samplingRate;
    const key = `${start}-${end}`;

    // Generate realistic distribution (bell curve around 25-30°C)
    const midpoint = 27;
    const distance = Math.abs((start + end) / 2 - midpoint);
    const minutes = Math.max(0, 60 - distance * 3) * (0.5 + Math.random());

    if (minutes > 0.5) {
      distribution[key] = parseFloat(minutes.toFixed(1));
    }
  }

  return distribution;
}

// Enable/disable mock mode
// NOTE: Using mock data because real API has SSL certificate issues (ERR_CERT_COMMON_NAME_INVALID)
// The API works (verified with curl -k) but browsers reject the invalid SSL certificate
// This is a server-side issue that Zenfinity needs to fix, or will be resolved after deployment
export const USE_MOCK_DATA = true; // Set to false to use real API
