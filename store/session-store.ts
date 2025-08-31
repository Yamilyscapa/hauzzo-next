import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface SessionStore {
  user: User | null;
  role: string | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useSessionStore = create<SessionStore>()(
  persist(
    (set) => ({
      user: null,
      role: null,
      isAuthenticated: false,
      setUser: (user) =>
        set({
          user,
          role: user?.role,
          isAuthenticated: !!user,
        }),
      logout: () =>
        set({
          user: null,
          role: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "ui-session-storage",
    },
  ),
);
