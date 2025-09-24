// stores/useAuthStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      login: async (email: string, password: string) => {
        set({ isLoading: true });

        try {
          // Simulación de API login
          // 🔑 Aquí debes reemplazar por tu fetch/axios al backend
          const response = await new Promise<{ user: User; token: string }>((resolve) =>
            setTimeout(
              () =>
                resolve({
                  user: { id: "1", name: "Juan Pérez", email },
                  token: "fake-jwt-token-123",
                }),
              1000
            )
          );

          set({ user: response.user, token: response.token, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      logout: () => {
        set({ user: null, token: null });
      },
    }),
    {
      name: "auth-storage",
      storage: {
        getItem: async (name) => {
          const value = await AsyncStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name, value) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name) => {
          await AsyncStorage.removeItem(name);
        },
      },
    }
  )
);
