import { create } from 'zustand';
import type { PermissionCapability } from '../types';
import { evaluatePermissionCapabilities } from '../services/permissionService';

interface PermissionState {
  capabilities: PermissionCapability[];
  loading: boolean;
  evaluated: boolean;
  loadCapabilities: () => Promise<void>;
  updateCapability: (id: PermissionCapability['id'], capability: PermissionCapability) => void;
}

export const usePermissionStore = create<PermissionState>((set) => ({
  capabilities: [],
  loading: false,
  evaluated: false,
  loadCapabilities: async () => {
    set({ loading: true });
    const capabilities = await evaluatePermissionCapabilities();
    set({ capabilities, loading: false, evaluated: true });
  },
  updateCapability: (id, capability) =>
    set((state) => ({
      capabilities: state.capabilities.map((item) => (item.id === id ? capability : item)),
    })),
}));
