import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import GenericModal from '@/components/ui/GenericModal';
import { CText } from '@/components/CText';
import { CView } from '@/components/CView';
import { useAppTheme } from '@/theme';
import { fontScaleOptions, useAppearanceStore } from '@/hooks/useAppearanceStore';

type Props = {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const FontSizeSettingsModal = ({ showModal, setShowModal }: Props) => {
  const theme = useAppTheme();
  const fontScale = useAppearanceStore((state) => state.fontScale);
  const setFontScale = useAppearanceStore((state) => state.setFontScale);

  const handleSelectScale = (scale: number) => {
    setFontScale(scale);
    setShowModal(false);
  };

  return (
    <GenericModal
      title="Ajustes de fuente"
      showModal={showModal}
      setShowModal={setShowModal}
      showConfirmButton={false}
      textCloseButton="Cerrar"
      nodeContent={
        <CView style={styles.content}>
          <CView
            style={[
              styles.previewCard,
              {
                backgroundColor: theme.colors.surface.card,
                borderColor: theme.colors.border.default,
              },
            ]}
          >
            <CText type="subtitle">Vista previa</CText>
            <CText>
              Así se verán los textos principales en toda la aplicación.
            </CText>
          </CView>
          {fontScaleOptions.map((item) => {
            const isSelected = item.scale === fontScale;

            return (
              <TouchableOpacity
                key={item.key}
                activeOpacity={0.9}
                onPress={() => handleSelectScale(item.scale)}
                style={[
                  styles.optionCard,
                  {
                    backgroundColor: theme.colors.surface.card,
                    borderColor: isSelected ? theme.colors.brand.primary : theme.colors.border.default,
                  },
                ]}
              >
                <CText type="subtitle">{item.label}</CText>
                <CText style={{ fontSize: 16 * item.scale, lineHeight: 22 * item.scale }}>
                  Texto de ejemplo para el tamaño seleccionado
                </CText>
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
  previewCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    gap: 8,
  },
  optionCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    gap: 8,
  },
});

export default FontSizeSettingsModal;
