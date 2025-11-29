import { useContext } from 'react';
import { AppContext } from '../contexts/appContextDef';
import type { AppContextType } from '../types';

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
