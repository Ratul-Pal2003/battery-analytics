import { useCycleContext } from '../../context/CycleContext';
import { Card } from '../common/Card';

/**
 * Alert Panel Component
 * Displays warnings and protection events for battery safety monitoring
 */
export function AlertPanel() {
  const { currentCycle } = useCycleContext();

  if (!currentCycle) {
    return (
      <Card title="⚠️ Alerts & Safety">
        <p className="text-gray-600">Select a cycle to view safety alerts.</p>
      </Card>
    );
  }

  const { alert_details, warning_count, protection_count } = currentCycle;
  const warnings = alert_details.warnings || [];
  const protections = alert_details.protections || [];
  const hasAlerts = warnings.length > 0 || protections.length > 0;

  return (
    <Card
      title="⚠️ Alerts & Safety"
      subtitle={`Cycle #${currentCycle.cycle_number} - Battery Safety Monitor`}
      className="border-l-4 border-orange-500"
    >
      {/* Alert Summary */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Warning Count */}
        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg p-4 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-yellow-700 font-medium uppercase mb-1">Warnings</p>
              <p className="text-3xl font-bold text-yellow-900">{warning_count}</p>
            </div>
            <div className="bg-yellow-500 rounded-full p-3">
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
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Protection Count */}
        <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-lg p-4 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-red-700 font-medium uppercase mb-1">Protections</p>
              <p className="text-3xl font-bold text-red-900">{protection_count}</p>
            </div>
            <div className="bg-red-500 rounded-full p-3">
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
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Details */}
      {hasAlerts ? (
        <div className="space-y-4">
          {/* Warnings List */}
          {warnings.length > 0 && (
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-yellow-600 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <h4 className="text-sm font-semibold text-yellow-900 mb-2">
                    Warning Events ({warnings.length})
                  </h4>
                  <ul className="space-y-2">
                    {warnings.map((warning, index) => (
                      <li
                        key={index}
                        className="flex items-start text-sm text-yellow-800 bg-white bg-opacity-50 rounded px-3 py-2"
                      >
                        <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                        <span>{warning}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Protections List */}
          {protections.length > 0 && (
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-red-600 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <h4 className="text-sm font-semibold text-red-900 mb-2">
                    Protection Events ({protections.length})
                  </h4>
                  <ul className="space-y-2">
                    {protections.map((protection, index) => (
                      <li
                        key={index}
                        className="flex items-start text-sm text-red-800 bg-white bg-opacity-50 rounded px-3 py-2"
                      >
                        <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                        <span>{protection}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* All Clear Message */
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
          <div className="flex items-center justify-center">
            <div className="bg-green-500 rounded-full p-3 mr-4">
              <svg
                className="w-8 h-8 text-white"
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
            <div>
              <h3 className="text-lg font-bold text-green-900 mb-1">All Clear</h3>
              <p className="text-sm text-green-700">
                No warnings or protection events detected during this cycle.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Info Section */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0"
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
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">About Safety Alerts</p>
              <p className="mb-2">
                <strong>Warnings</strong> indicate conditions that require attention but do not
                immediately threaten battery safety (e.g., high temperature, low SOC).
              </p>
              <p>
                <strong>Protection Events</strong> are critical safety mechanisms that activate to
                prevent damage (e.g., overcurrent protection, overvoltage protection).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-500 font-medium uppercase">Data Points</p>
          <p className="text-lg font-bold text-gray-900 mt-1">
            {currentCycle.data_points_count.toLocaleString()}
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-500 font-medium uppercase">Avg Temp</p>
          <p className="text-lg font-bold text-gray-900 mt-1">
            {currentCycle.average_temperature.toFixed(1)}°C
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-500 font-medium uppercase">Avg Voltage</p>
          <p className="text-lg font-bold text-gray-900 mt-1">
            {currentCycle.voltage_avg.toFixed(1)}V
          </p>
        </div>
      </div>
    </Card>
  );
}

export default AlertPanel;
