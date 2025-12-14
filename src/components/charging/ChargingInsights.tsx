import { useCycleContext } from '../../context/CycleContext';
import { Card } from '../common/Card';
import { safeToFixed, safeNumber } from '../../utils/formatters';

/**
 * Charging Insights Component
 * Displays charging patterns and efficiency for the current cycle
 */
export function ChargingInsights() {
  const { currentCycle } = useCycleContext();

  if (!currentCycle) {
    return (
      <Card title="🔋 Charging Insights">
        <p className="text-gray-600">Select a cycle to view charging patterns.</p>
      </Card>
    );
  }

  const charging_instances_count = safeNumber(currentCycle.charging_instances_count, 0);
  const average_charge_start_soc = safeNumber(currentCycle.average_charge_start_soc, 0);
  const average_soc = safeNumber(currentCycle.average_soc, 0);
  const cycle_duration_hours = safeNumber(currentCycle.cycle_duration_hours, 1);

  // Calculate charging efficiency metrics
  const socGainPerCharge = charging_instances_count > 0
    ? (100 - average_charge_start_soc) / charging_instances_count
    : 0;

  const chargingFrequency = charging_instances_count / cycle_duration_hours;

  return (
    <Card
      title="🔋 Charging Insights"
      subtitle={`Cycle #${currentCycle.cycle_number} - Charging Patterns`}
      className="border-l-4 border-indigo-500"
    >
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Charging Instances */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg p-5 border-l-4 border-indigo-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-indigo-700 font-medium uppercase mb-1">
                Charging Events
              </p>
              <p className="text-4xl font-bold text-indigo-900 mb-1">
                {charging_instances_count}
              </p>
              <p className="text-xs text-indigo-600">
                {safeToFixed(chargingFrequency, 2)} charges/hour
              </p>
            </div>
            <div className="bg-indigo-500 rounded-full p-4">
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
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Average Charge Start SOC */}
        <div className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-lg p-5 border-l-4 border-cyan-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-cyan-700 font-medium uppercase mb-1">
                Avg Charge Start
              </p>
              <p className="text-4xl font-bold text-cyan-900 mb-1">
                {safeToFixed(average_charge_start_soc, 0)}%
              </p>
              <p className="text-xs text-cyan-600">
                SOC when charging begins
              </p>
            </div>
            <div className="bg-cyan-500 rounded-full p-4">
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
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Charging Pattern Visualization */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Charging Pattern</h4>
        <div className="bg-gradient-to-r from-gray-100 to-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            {Array.from({ length: Math.min(charging_instances_count, 10) }).map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="bg-indigo-500 rounded-full p-2 mb-1 animate-pulse">
                  <svg
                    className="w-4 h-4 text-white"
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
                <span className="text-xs text-gray-500">#{i + 1}</span>
              </div>
            ))}
            {charging_instances_count > 10 && (
              <div className="flex flex-col items-center">
                <div className="bg-gray-400 rounded-full p-2 mb-1">
                  <span className="text-xs text-white font-bold">+{charging_instances_count - 10}</span>
                </div>
                <span className="text-xs text-gray-500">more</span>
              </div>
            )}
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 transition-all duration-1000"
              style={{ width: `${Math.min((charging_instances_count / 5) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-500 font-medium uppercase">SOC Gain</p>
          <p className="text-lg font-bold text-gray-900 mt-1">
            +{safeToFixed(socGainPerCharge, 1)}%
          </p>
          <p className="text-xs text-gray-500 mt-1">per charge</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-500 font-medium uppercase">Avg SOC</p>
          <p className="text-lg font-bold text-gray-900 mt-1">
            {safeToFixed(average_soc, 1)}%
          </p>
          <p className="text-xs text-gray-500 mt-1">during cycle</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-500 font-medium uppercase">Duration</p>
          <p className="text-lg font-bold text-gray-900 mt-1">
            {safeToFixed(cycle_duration_hours, 1)}h
          </p>
          <p className="text-xs text-gray-500 mt-1">total time</p>
        </div>
      </div>

      {/* Charging Strategy Insight */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-start">
          <div className="bg-blue-500 rounded-full p-2 mr-3 flex-shrink-0">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-blue-900 mb-1">Charging Strategy</h4>
            <p className="text-sm text-blue-800">
              {charging_instances_count === 0 && "No charging events detected during this cycle."}
              {charging_instances_count === 1 && "Single charge cycle - battery maintained well."}
              {charging_instances_count === 2 && "Moderate charging - good balance between usage and recharge."}
              {charging_instances_count >= 3 && charging_instances_count <= 5 && "Frequent charging pattern - optimal for battery longevity."}
              {charging_instances_count > 5 && "High frequency charging - ensure charger is functioning properly."}
            </p>
            <p className="text-xs text-blue-700 mt-2">
              Average charge starts at {safeToFixed(average_charge_start_soc, 0)}% SOC
              {average_charge_start_soc < 20 && " (⚠️ Low - consider charging earlier)"}
              {average_charge_start_soc >= 20 && average_charge_start_soc < 40 && " (✓ Good range)"}
              {average_charge_start_soc >= 40 && " (💡 Optimal - prevents deep discharge)"}
            </p>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0"
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
            <div className="text-sm text-purple-800">
              <p className="font-semibold mb-1">About Charging Insights</p>
              <p>
                Li-ion LFP batteries benefit from frequent, partial charges rather than full
                discharge cycles. Charging before SOC drops below 20% helps extend battery lifespan.
                The metrics above help identify charging patterns and optimization opportunities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default ChargingInsights;
