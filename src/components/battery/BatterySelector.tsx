import { useBatteryContext } from '../../context/BatteryContext';
import { useBatterySummary } from '../../hooks/useBatterySummary';
import { AUTHORIZED_IMEIS } from '../../utils/constants';
import { useEffect } from 'react';

/**
 * Battery Selector Component
 * Allows users to choose between authorized battery IMEIs
 */
export function BatterySelector() {
  const { selectedIMEI, setSelectedIMEI, setBatterySummary } = useBatteryContext();
  const { data: summaries, isLoading } = useBatterySummary();

  // Update battery summary when data is loaded
  useEffect(() => {
    if (summaries && selectedIMEI) {
      const summary = summaries.find((s) => s.imei === selectedIMEI);
      if (summary) {
        setBatterySummary(summary);
      }
    }
  }, [summaries, selectedIMEI, setBatterySummary]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedIMEI(event.target.value);
  };

  return (
    <div className="flex items-center space-x-3">
      <label
        htmlFor="battery-select"
        className="text-sm font-medium text-white whitespace-nowrap"
      >
        Select Battery:
      </label>
      <div className="relative">
        <select
          id="battery-select"
          value={selectedIMEI || ''}
          onChange={handleChange}
          disabled={isLoading}
          className="appearance-none bg-white border border-blue-300 rounded-lg px-4 py-2 pr-10 text-gray-900 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px]"
        >
          {AUTHORIZED_IMEIS.map((imei) => {
            const summary = summaries?.find((s) => s.imei === imei);
            return (
              <option key={imei} value={imei}>
                {imei}
                {summary?.total_cycles ? ` (${summary.total_cycles} cycles)` : ''}
              </option>
            );
          })}
        </select>

        {/* Dropdown arrow icon */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg
            className="fill-current h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex items-center text-white text-sm">
          <svg
            className="animate-spin h-4 w-4 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading...
        </div>
      )}
    </div>
  );
}

export default BatterySelector;
