import { create } from 'zustand';

export interface AssessmentUser {
  fullName: string;
  email: string;
  organization: string;
  purpose: 'Personal' | 'Business' | 'Enterprise' | '';
}

interface UserState {
  user: AssessmentUser;
  setUser: (user: AssessmentUser) => void;
  updateUser: (updates: Partial<AssessmentUser>) => void;
}

const initialUser: AssessmentUser = {
  fullName: '',
  email: '',
  organization: '',
  purpose: '',
};

export const useUserStore = create<UserState>((set) => ({
  user: initialUser,
  setUser: (user) => set({ user }),
  updateUser: (updates) =>
    set((state) => ({
      user: { ...state.user, ...updates },
    })),
}));
