import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './services/api/queryClient';
import { BatteryProvider } from './context/BatteryContext';
import { CycleProvider } from './context/CycleContext';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { BatterySelector } from './components/battery/BatterySelector';
import { BatterySummaryCard } from './components/battery/BatterySummaryCard';
import { CycleNavigator } from './components/cycle/CycleNavigator';
import { CycleStatsCard } from './components/cycle/CycleStatsCard';
import { TemperatureDistChart } from './components/charts/TemperatureDistChart';
import { BatteryHealthChart } from './components/charts/BatteryHealthChart';
import { PerformanceChart } from './components/charts/PerformanceChart';
import { AlertPanel } from './components/alerts/AlertPanel';
import { ChargingInsights } from './components/charging/ChargingInsights';
import { LongTermTrends } from './components/charts/LongTermTrends';

function App() {
  return (
    <DashboardLayout headerActions={<BatterySelector />}>
      {/* Battery Summary */}
      <div className="mb-8">
        <BatterySummaryCard />
      </div>

      {/* Cycle Navigation & Stats */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-1">
          <CycleNavigator />
        </div>
        <div className="lg:col-span-2">
          <CycleStatsCard />
        </div>
      </div>

      {/* Temperature Distribution Chart */}
      <div className="mb-8">
        <TemperatureDistChart />
      </div>

      {/* Battery Health Metrics Chart */}
      <div className="mb-8">
        <BatteryHealthChart />
      </div>

      {/* Performance Metrics Chart */}
      <div className="mb-8">
        <PerformanceChart />
      </div>


      {/* Additional Features */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <AlertPanel />
        <ChargingInsights />
      </div>

      {/* Bonus Feature - Long-term Trend Analysis */}
      <div className="mb-8">
        <LongTermTrends />
      </div>
    </DashboardLayout>
  );
}

// Wrap with providers
export default function AppWrapper() {
  return (
    <QueryClientProvider client={queryClient}>
      <BatteryProvider>
        <CycleProvider>
          <App />
        </CycleProvider>
      </BatteryProvider>
    </QueryClientProvider>
  );
}
