import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import GenericModal from '@/components/ui/GenericModal';
import { CText } from '@/components/CText';
import { CView } from '@/components/CView';
import { useAppTheme } from '@/theme';
import { useAppearanceStore, type AppThemePreset } from '@/hooks/useAppearanceStore';

interface ThemeOption {
  key: AppThemePreset;
  title: string;
  palette: string[];
}

type Props = {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const themeOptions: ThemeOption[] = [
  {
    key: 'sunset',
    title: 'Sunset',
    palette: ['#FF9A86', '#FFB399', '#FFD6A6', '#FFF0BE'],
  },
  {
    key: 'greenland',
    title: 'Greenland',
    palette: ['#346739', '#79AE6F', '#9FCB98', '#F2EDC2'],
  },
  {
    key: 'light',
    title: 'Light',
    palette: ['#02dbb7', '#B0BEC5', '#EEF2F6', '#FFFFFF'],
  },
  {
    key: 'dark',
    title: 'Dark',
    palette: ['#02dbb7', '#4A4A6A', '#252538', '#1A1A2E'],
  },
];

const ThemeSettingsModal = ({ showModal, setShowModal }: Props) => {
  const theme = useAppTheme();
  const themePreset = useAppearanceStore((state) => state.themePreset);
  const setThemePreset = useAppearanceStore((state) => state.setThemePreset);

  const handleSelectTheme = (preset: AppThemePreset) => {
    setThemePreset(preset);
    setShowModal(false);
  };

  return (
    <GenericModal
      title="Selecciona un tema"
      showModal={showModal}
      setShowModal={setShowModal}
      showConfirmButton={false}
      textCloseButton="Cerrar"
      nodeContent={
        <CView style={styles.content}>
          {themeOptions.map((item) => {
            const isSelected = item.key === themePreset;

            return (
              <TouchableOpacity
                key={item.key}
                activeOpacity={0.9}
                onPress={() => handleSelectTheme(item.key)}
                style={[
                  styles.optionCard,
                  {
                    backgroundColor: theme.colors.surface.card,
                    borderColor: isSelected ? theme.colors.brand.primary : theme.colors.border.default,
                  },
                ]}
              >
                <CView style={styles.optionHeader}>
                  <CText type="subtitle">{item.title}</CText>
                  <CText style={{ color: theme.colors.text.secondary }}>
                    {isSelected ? 'Activo' : 'Tocar para aplicar'}
                  </CText>
                </CView>
                <View style={styles.paletteRow}>
                  {item.palette.map((color) => (
                    <View key={`${item.key}-${color}`} style={[styles.paletteSwatch, { backgroundColor: color }]} />
                  ))}
                </View>
              </TouchableOpacity>
            );
          })}
        </CView>
      }
    />
  );
};

const styles = StyleSheet.create({
  content: {
    gap: 12,
  },
  optionCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    gap: 10,
  },
  optionHeader: {
    gap: 4,
    backgroundColor: 'transparent',
  },
  paletteRow: {
    flexDirection: 'row',
    gap: 8,
  },
  paletteSwatch: {
    flex: 1,
    height: 38,
    borderRadius: 12,
  },
});

export default ThemeSettingsModal;
