import { create } from 'zustand';

import type { LoadStatus } from '../types/dashboard';

interface DashboardStore {
  loadStatus: LoadStatus;
  errorMessage: string;
  setLoadStatus: (s: LoadStatus) => void;
  setErrorMessage: (m: string) => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  loadStatus: 'idle',
  errorMessage: '',
  setLoadStatus: (s) => set({ loadStatus: s }),
  setErrorMessage: (m) => set({ errorMessage: m }),
}));

