import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type AppThemePreset = 'light' | 'dark' | 'sunset' | 'greenland';

export interface FontScaleOption {
  key: string;
  label: string;
  scale: number;
}

interface AppearanceState {
  themePreset: AppThemePreset;
  fontScale: number;
  setThemePreset: (themePreset: AppThemePreset) => void;
  setFontScale: (fontScale: number) => void;
}

export const fontScaleOptions: FontScaleOption[] = [
  { key: 'small', label: 'Pequeña', scale: 0.9 },
  { key: 'medium', label: 'Mediana', scale: 1 },
  { key: 'large', label: 'Grande', scale: 1.15 },
  { key: 'xlarge', label: 'Extra grande', scale: 1.3 },
];

export const useAppearanceStore = create<AppearanceState>()(
  persist(
    (set) => ({
      themePreset: 'light',
      fontScale: 1,
      setThemePreset: (themePreset) => set({ themePreset }),
      setFontScale: (fontScale) => set({ fontScale }),
    }),
    {
      name: 'appearance-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
