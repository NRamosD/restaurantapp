import { create } from "zustand";
import { persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

interface User {
  id: string;
  name: string;
  email: string;
  negocio_id: string;
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
            id: userData.id,
            name: userData.name,
            email: userData.email,
            negocio_id: userData.negocio_id,
          };

          set({ user, token: userData.id, isLoading: false });
          router.dismissAll();
          router.replace("/(tabs)");

          return { status: "success" };
        } catch (error) {
          set({ isLoading: false });
          return { status: (error as Error).message };
        }
      },
      logout: () => {
        set({ user: null, token: null });
        router.replace("/(auth)/login");
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
