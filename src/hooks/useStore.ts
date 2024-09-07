import { create } from "zustand";

interface BearState {
  ready: boolean;
  isReady: () => void;
}

export const useStore = create<BearState>()((set) => ({
  ready: false,
  isReady: () => set(() => ({ ready: true })),
}));
