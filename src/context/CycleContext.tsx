import { createContext, useContext, useState, ReactNode } from 'react';
import type { CycleSnapshot } from '../types/battery';

interface CycleContextType {
  currentCycle: CycleSnapshot | null;
  setCurrentCycle: (cycle: CycleSnapshot | null) => void;
  currentCycleNumber: number | null;
  setCurrentCycleNumber: (cycleNumber: number | null) => void;
}

const CycleContext = createContext<CycleContextType | undefined>(undefined);

interface CycleProviderProps {
  children: ReactNode;
}

/**
 * Cycle Context Provider
 * Manages the currently selected cycle and its data
 */
export function CycleProvider({ children }: CycleProviderProps) {
  const [currentCycle, setCurrentCycle] = useState<CycleSnapshot | null>(null);
  const [currentCycleNumber, setCurrentCycleNumber] = useState<number | null>(null);

  return (
    <CycleContext.Provider
      value={{
        currentCycle,
        setCurrentCycle,
        currentCycleNumber,
        setCurrentCycleNumber,
      }}
    >
      {children}
    </CycleContext.Provider>
  );
}

/**
 * Custom hook to use Cycle Context
 */
export function useCycleContext() {
  const context = useContext(CycleContext);
  if (context === undefined) {
    throw new Error('useCycleContext must be used within a CycleProvider');
  }
  return context;
}

export default CycleContext;
