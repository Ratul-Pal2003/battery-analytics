import { useBatteryContext } from '../../context/BatteryContext';
import { Card } from '../common/Card';

/**
 * Battery Summary Card Component
 * Displays high-level stats for the currently selected battery
 */
export function BatterySummaryCard() {
  const { selectedIMEI, batterySummary } = useBatteryContext();

  if (!selectedIMEI || !batterySummary) {
    return null;
  }

  return (
    <Card
      title="Battery Overview"
      subtitle={`IMEI: ${selectedIMEI}`}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Cycles */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700 font-medium">Total Cycles</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">
                {batterySummary.total_cycles || 'N/A'}
              </p>
            </div>
            <div className="bg-blue-600 rounded-full p-3">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Average Health */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 font-medium">Average Health</p>
              <p className="text-3xl font-bold text-green-900 mt-2">
                {batterySummary.avg_soh_across_cycles ? `${batterySummary.avg_soh_across_cycles.toFixed(1)}%` : 'N/A'}
              </p>
            </div>
            <div className="bg-green-600 rounded-full p-3">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Last Updated */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-700 font-medium">Last Cycle</p>
              <p className="text-sm font-semibold text-purple-900 mt-2">
                {batterySummary.last_cycle_time
                  ? new Date(batterySummary.last_cycle_time).toLocaleDateString()
                  : 'N/A'}
              </p>
              <p className="text-xs text-purple-700 mt-1">
                {batterySummary.last_cycle_time
                  ? new Date(batterySummary.last_cycle_time).toLocaleTimeString()
                  : ''}
              </p>
            </div>
            <div className="bg-purple-600 rounded-full p-3">
              <svg
                className="w-6 h-6 text-white"
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
          </div>
        </div>
      </div>

      {/* Battery Info */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center text-sm text-gray-600">
          <svg
            className="w-5 h-5 mr-2 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Battery Chemistry: Li-ion LFP (Lithium Iron Phosphate)</span>
        </div>
      </div>
    </Card>
  );
}

export default BatterySummaryCard;
