import { create } from "zustand";

interface UserState {
  user: null | { id: number; name: string; email: string };
  setUser: (user: any) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
