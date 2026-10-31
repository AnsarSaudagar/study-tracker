import { useContext } from 'react';
import { TrackerContext } from '@/context/TrackerContext';

export function useTracker() {
  const ctx = useContext(TrackerContext);
  if (!ctx) {
    throw new Error('useTracker must be used within a TrackerProvider');
  }
  return ctx;
}
