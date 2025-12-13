import { useCycleContext } from '../../context/CycleContext';
import { Card } from '../common/Card';

/**
 * Cycle Stats Card Component
 * Displays key statistics for the currently selected cycle
 */
export function CycleStatsCard() {
  const { currentCycle } = useCycleContext();

  if (!currentCycle) {
    return (
      <Card title="Cycle Statistics">
        <p className="text-gray-600">Select a cycle to view statistics.</p>
      </Card>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card
      title="Cycle Statistics"
      subtitle={`Cycle #${currentCycle.cycle_number}`}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Cycle Duration */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-purple-700 font-medium">Duration</p>
            <svg
              className="w-5 h-5 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-2xl font-bold text-purple-900">
            {currentCycle.cycle_duration_hours.toFixed(1)}
          </p>
          <p className="text-xs text-purple-700 mt-1">hours</p>
        </div>

        {/* SOH Drop */}
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-red-700 font-medium">SOH Drop</p>
            <svg
              className="w-5 h-5 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
              />
            </svg>
          </div>
          <p className="text-2xl font-bold text-red-900">
            {currentCycle.soh_drop.toFixed(2)}%
          </p>
          <p className="text-xs text-red-700 mt-1">health decrease</p>
        </div>

        {/* Average SOC */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-green-700 font-medium">Avg SOC</p>
            <svg
              className="w-5 h-5 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <p className="text-2xl font-bold text-green-900">
            {currentCycle.average_soc.toFixed(1)}%
          </p>
          <p className="text-xs text-green-700 mt-1">
            {currentCycle.min_soc.toFixed(0)}% - {currentCycle.max_soc.toFixed(0)}% range
          </p>
        </div>

        {/* Average Temperature */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-orange-700 font-medium">Avg Temp</p>
            <svg
              className="w-5 h-5 text-orange-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <p className="text-2xl font-bold text-orange-900">
            {currentCycle.average_temperature.toFixed(1)}°C
          </p>
          <p className="text-xs text-orange-700 mt-1">battery pack temp</p>
        </div>
      </div>

      {/* Time Range */}
      <div className="mt-6 pt-6 border-t border-gray-200 grid md:grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
            Start Time
          </p>
          <p className="text-sm text-gray-900 font-semibold">
            {formatDate(currentCycle.cycle_start_time)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
            End Time
          </p>
          <p className="text-sm text-gray-900 font-semibold">
            {formatDate(currentCycle.cycle_end_time)}
          </p>
        </div>
      </div>

      {/* Additional Stats Grid */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <p className="text-xs text-gray-500 font-medium">Distance</p>
          <p className="text-lg font-bold text-gray-900 mt-1">
            {currentCycle.total_distance.toFixed(1)} km
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 font-medium">Avg Speed</p>
          <p className="text-lg font-bold text-gray-900 mt-1">
            {currentCycle.average_speed.toFixed(1)} km/h
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 font-medium">Max Speed</p>
          <p className="text-lg font-bold text-gray-900 mt-1">
            {currentCycle.max_speed.toFixed(1)} km/h
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 font-medium">Charging Events</p>
          <p className="text-lg font-bold text-gray-900 mt-1">
            {currentCycle.charging_instances_count}
          </p>
        </div>
      </div>

      {/* Voltage Stats */}
      <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h4 className="text-sm font-semibold text-blue-900 mb-3">Voltage Metrics</h4>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-blue-700">Average</p>
            <p className="text-lg font-bold text-blue-900 mt-1">
              {currentCycle.voltage_avg.toFixed(2)}V
            </p>
          </div>
          <div>
            <p className="text-xs text-blue-700">Minimum</p>
            <p className="text-lg font-bold text-blue-900 mt-1">
              {currentCycle.voltage_min.toFixed(2)}V
            </p>
          </div>
          <div>
            <p className="text-xs text-blue-700">Maximum</p>
            <p className="text-lg font-bold text-blue-900 mt-1">
              {currentCycle.voltage_max.toFixed(2)}V
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default CycleStatsCard;
