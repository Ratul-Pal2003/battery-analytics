import { useState, useEffect } from 'react';
import { useBatteryContext } from '../../context/BatteryContext';
import { useCycleContext } from '../../context/CycleContext';
import { useCycleSnapshots } from '../../hooks/useCycleSnapshots';
import { useCycleDetails } from '../../hooks/useCycleDetails';
import { Card } from '../common/Card';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';

/**
 * Cycle Navigator Component
 * Allows users to navigate through battery cycles with a slider
 */
export function CycleNavigator() {
  const { selectedIMEI } = useBatteryContext();
  const { currentCycleNumber, setCurrentCycleNumber, setCurrentCycle } = useCycleContext();
  const [sliderValue, setSliderValue] = useState(1);

  // Fetch all cycles for the selected battery
  const { data: snapshotsData, isLoading, error } = useCycleSnapshots({
    imei: selectedIMEI || '',
    limit: 1000, // Get all cycles
  });

  // Fetch details for the current cycle
  const {
    data: cycleDetails,
    isLoading: isLoadingDetails,
    error: detailsError,
  } = useCycleDetails(selectedIMEI, currentCycleNumber);

  // Update context when cycle details are fetched
  useEffect(() => {
    if (cycleDetails) {
      setCurrentCycle(cycleDetails);
    }
  }, [cycleDetails, setCurrentCycle]);

  // Set initial cycle when data loads
  useEffect(() => {
    if (snapshotsData?.snapshots && snapshotsData.snapshots.length > 0) {
      const firstCycle = snapshotsData.snapshots[0].cycle_number;
      if (!currentCycleNumber) {
        setCurrentCycleNumber(firstCycle);
        setSliderValue(firstCycle);
      }
    }
  }, [snapshotsData, currentCycleNumber, setCurrentCycleNumber]);

  if (!selectedIMEI) {
    return (
      <Card title="Cycle Navigator">
        <p className="text-gray-600">Please select a battery to view cycles.</p>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card title="Cycle Navigator">
        <LoadingSpinner message="Loading cycles..." />
      </Card>
    );
  }

  if (error) {
    return (
      <Card title="Cycle Navigator">
        <ErrorMessage
          title="Failed to Load Cycles"
          message={error.message}
        />
      </Card>
    );
  }

  const cycles = snapshotsData?.snapshots || [];
  const totalCycles = cycles.length;
  const minCycle = cycles.length > 0 ? Math.min(...cycles.map((c) => c.cycle_number)) : 1;
  const maxCycle = cycles.length > 0 ? Math.max(...cycles.map((c) => c.cycle_number)) : 1;

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    setSliderValue(value);
    setCurrentCycleNumber(value);
  };

  const handlePrevious = () => {
    if (currentCycleNumber && currentCycleNumber > minCycle) {
      const newCycle = currentCycleNumber - 1;
      setCurrentCycleNumber(newCycle);
      setSliderValue(newCycle);
    }
  };

  const handleNext = () => {
    if (currentCycleNumber && currentCycleNumber < maxCycle) {
      const newCycle = currentCycleNumber + 1;
      setCurrentCycleNumber(newCycle);
      setSliderValue(newCycle);
    }
  };

  const handleFirst = () => {
    setCurrentCycleNumber(minCycle);
    setSliderValue(minCycle);
  };

  const handleLatest = () => {
    setCurrentCycleNumber(maxCycle);
    setSliderValue(maxCycle);
  };

  return (
    <Card
      title="Cycle Navigator"
      subtitle={`${totalCycles} cycles available for IMEI ${selectedIMEI}`}
    >
      {/* Navigation Controls */}
      <div className="space-y-6">
        {/* Current Cycle Display */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700 font-medium">Current Cycle</p>
              <p className="text-4xl font-bold text-blue-900 mt-1">
                {currentCycleNumber || '-'}
              </p>
              {isLoadingDetails && (
                <p className="text-xs text-blue-600 mt-2">Loading cycle details...</p>
              )}
              {detailsError && (
                <p className="text-xs text-red-600 mt-2">Failed to load details</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-700 font-medium">Total Cycles</p>
              <p className="text-4xl font-bold text-blue-900 mt-1">{totalCycles}</p>
            </div>
          </div>
        </div>

        {/* Quick Navigation Buttons */}
        <div className="flex justify-between gap-2">
          <button
            onClick={handleFirst}
            disabled={currentCycleNumber === minCycle}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
          >
            First
          </button>
          <button
            onClick={handlePrevious}
            disabled={currentCycleNumber === minCycle}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
          >
            ← Previous
          </button>
          <button
            onClick={handleNext}
            disabled={currentCycleNumber === maxCycle}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
          >
            Next →
          </button>
          <button
            onClick={handleLatest}
            disabled={currentCycleNumber === maxCycle}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
          >
            Latest
          </button>
        </div>

        {/* Slider */}
        <div className="space-y-2">
          <label htmlFor="cycle-slider" className="text-sm font-medium text-gray-700">
            Slide to navigate cycles:
          </label>
          <input
            id="cycle-slider"
            type="range"
            min={minCycle}
            max={maxCycle}
            value={sliderValue}
            onChange={handleSliderChange}
            className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            style={{
              background: `linear-gradient(to right, #2563eb 0%, #2563eb ${
                ((sliderValue - minCycle) / (maxCycle - minCycle)) * 100
              }%, #dbeafe ${((sliderValue - minCycle) / (maxCycle - minCycle)) * 100}%, #dbeafe 100%)`,
            }}
          />
          <div className="flex justify-between text-xs text-gray-600">
            <span>Cycle {minCycle}</span>
            <span>Cycle {maxCycle}</span>
          </div>
        </div>

        {/* Cycle Dropdown (Alternative) */}
        <div className="space-y-2">
          <label htmlFor="cycle-select" className="text-sm font-medium text-gray-700">
            Or select from dropdown:
          </label>
          <select
            id="cycle-select"
            value={currentCycleNumber || ''}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              setCurrentCycleNumber(value);
              setSliderValue(value);
            }}
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {cycles.map((cycle) => (
              <option key={cycle.cycle_number} value={cycle.cycle_number}>
                Cycle {cycle.cycle_number}
                {cycle.cycle_start_time
                  ? ` - ${new Date(cycle.cycle_start_time).toLocaleDateString()}`
                  : ''}
              </option>
            ))}
          </select>
        </div>
      </div>
    </Card>
  );
}

export default CycleNavigator;
