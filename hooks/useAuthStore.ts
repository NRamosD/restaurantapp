// stores/useAuthStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { ToastAndroid } from "react-native";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{status: string}>;
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
          const response = await new Promise<{ user: User|null; token: string|null }>((resolve) =>{
            setTimeout(
              () =>{
                if((email === "usuario@prueba.com" || email === "prueba") && password === "prueba123."){
                  resolve({ user: { id: "1", name: "Usuario Prueba", email }, token: "fake-jwt-token-123" });
                }else{
                  resolve({ user: null, token: null });
                }
              },
              1000
            );
          });
          if(!response.user || !response.token){
            return {status: "Credenciales incorrectas"};
          }

          set({ user: response.user, token: response.token, isLoading: false });
          if(response.token){
            router.dismissAll();
            router.replace("/")
          }
          return {status: "success"};
        } catch (error) {
          set({ isLoading: false });
          return {status: (error as Error).message};
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
