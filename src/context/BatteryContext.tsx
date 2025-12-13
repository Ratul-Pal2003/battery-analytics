import { createContext, useContext, useState, ReactNode } from 'react';
import { AUTHORIZED_IMEIS } from '../utils/constants';
import type { BatterySummary } from '../types/battery';

interface BatteryContextType {
  selectedIMEI: string | null;
  setSelectedIMEI: (imei: string) => void;
  batterySummary: BatterySummary | null;
  setBatterySummary: (summary: BatterySummary | null) => void;
}

const BatteryContext = createContext<BatteryContextType | undefined>(undefined);

interface BatteryProviderProps {
  children: ReactNode;
}

/**
 * Battery Context Provider
 * Manages the currently selected battery IMEI and its summary data
 */
export function BatteryProvider({ children }: BatteryProviderProps) {
  // Default to first authorized IMEI
  const [selectedIMEI, setSelectedIMEI] = useState<string | null>(AUTHORIZED_IMEIS[0]);
  const [batterySummary, setBatterySummary] = useState<BatterySummary | null>(null);

  return (
    <BatteryContext.Provider
      value={{
        selectedIMEI,
        setSelectedIMEI,
        batterySummary,
        setBatterySummary,
      }}
    >
      {children}
    </BatteryContext.Provider>
  );
}

/**
 * Custom hook to use Battery Context
 */
export function useBatteryContext() {
  const context = useContext(BatteryContext);
  if (context === undefined) {
    throw new Error('useBatteryContext must be used within a BatteryProvider');
  }
  return context;
}

export default BatteryContext;
