import { create } from "zustand";
import { persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface User {
  uuid: string;
  name: string;
  email: string;
  perfilNegocioUuid: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (userData: User) => Promise<{ status: string }>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      login: async (userData: User) => {
        set({ isLoading: true });

        try {
          const user: User = {
            uuid: userData.uuid,
            name: userData.name,
            email: userData.email,
            perfilNegocioUuid: userData.perfilNegocioUuid,
          };

          set({ user, token: userData.uuid, isLoading: false });

          return { status: "success" };
        } catch (error) {
          set({ isLoading: false });
          return { status: (error as Error).message };
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
