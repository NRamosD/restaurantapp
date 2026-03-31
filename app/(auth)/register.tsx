import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
} from 'react-native';
import { Text, TextInput, Button, Card, Avatar, RadioButton, HelperText } from 'react-native-paper';
import { router } from 'expo-router';
import { ToastAndroid } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors, getColors } from '@/constants/Colors';
import { useSQLiteContext } from 'expo-sqlite';
import { createProfile } from '@/db/profile.operations';
import { uuid } from '@/assets/utils/uuid';
import { hashPassword } from '@/assets/utils/hash_pass';

type Props = {};

type FormData = {
  nombre_perfil: string;
  correo: string;
  telefono: string;
  password_perfil: string;
  password_perfil2: string;
  tipo_negocio: string;
};

export default function RegisterScreen({}: Props) {
  const colorScheme = useColorScheme();
  const colors = getColors(colorScheme);
  const db = useSQLiteContext();

  const [formData, setFormData] = useState<FormData>({
    nombre_perfil: '',
    correo: '',
    telefono: '',
    password_perfil: '',
    password_perfil2: '',
    tipo_negocio: '',
  });

  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [secureTextEntry2, setSecureTextEntry2] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.nombre_perfil.trim()) {
      newErrors.nombre_perfil = 'El nombre es requerido';
    }

    if (!formData.correo.trim()) {
      newErrors.correo = 'El correo es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.correo)) {
      newErrors.correo = 'Correo inválido';
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es requerido';
    }

    if (!formData.password_perfil) {
      newErrors.password_perfil = 'La contraseña es requerida';
    } else if (formData.password_perfil.length < 6) {
      newErrors.password_perfil = 'Mínimo 6 caracteres';
    }

    if (formData.password_perfil !== formData.password_perfil2) {
      newErrors.password_perfil2 = 'Las contraseñas no coinciden';
    }

    if (!formData.tipo_negocio) {
      newErrors.tipo_negocio = 'Selecciona un tipo de negocio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      await createProfile(db, {
        uuid: uuid(),
        nombre_perfil: formData.nombre_perfil,
        correo: formData.correo,
        telefono: formData.telefono,
        password_perfil: await hashPassword(formData.password_perfil),
        tipo_perfil: 'admin',
        tipo_negocio: formData.tipo_negocio,
      });

      ToastAndroid.show('¡Cuenta creada exitosamente!', ToastAndroid.LONG);
      router.replace('/(auth)/login');
    } catch (error) {
      ToastAndroid.show('Error al crear la cuenta', ToastAndroid.LONG);
    } finally {
      setLoading(false);
    }
  };

  const negocioOptions = [
    { label: 'Restaurante', value: 'restaurante' },
    { label: 'Tienda', value: 'tienda' },
    { label: 'Almacén', value: 'almacen' },
    { label: 'Otro', value: 'otro' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Background decorative elements */}
      <View style={styles.decorativeTop} />
      <View style={styles.decorativeBottom} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Card style={[styles.card, { backgroundColor: colors.card }]} mode="elevated">
            {/* Card shimmer effect */}
            <View style={[styles.cardShimmer, { backgroundColor: colors.cardGradientEnd }]} />

            {/* Header Section */}
            <View style={styles.headerSection}>
              <View style={[styles.logoContainer, { backgroundColor: colors.tint + '15' }]}>
                <Avatar.Icon
                  size={80}
                  icon="account-plus"
                  style={[styles.logo, { backgroundColor: colors.tint }]}
                  color="#FFFFFF"
                />
              </View>
              <Text style={[styles.title, { color: colors.text }]}>
                Crear Cuenta
              </Text>
              <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
                Completa tus datos para registrarte
              </Text>
            </View>

            {/* Form Section */}
            <View style={styles.formSection}>
              {/* Nombre */}
              <View style={styles.inputContainer}>
                <TextInput
                  label="Nombre completo"
                  value={formData.nombre_perfil}
                  onChangeText={(text) => handleInputChange('nombre_perfil', text)}
                  mode="outlined"
                  autoCapitalize="words"
                  left={<TextInput.Icon icon="account" color={colors.inputIcon} />}
                  style={[styles.input, { backgroundColor: colors.card }]}
                  outlineColor={errors.nombre_perfil ? '#EF4444' : colors.inputBorder}
                  activeOutlineColor={errors.nombre_perfil ? '#EF4444' : colors.inputBorderActive}
                  textColor={colors.text}
                  placeholderTextColor={colors.disabled}
                />
                {errors.nombre_perfil && (
                  <HelperText type="error" visible={!!errors.nombre_perfil}>
                    {errors.nombre_perfil}
                  </HelperText>
                )}
              </View>

              {/* Correo */}
              <View style={styles.inputContainer}>
                <TextInput
                  label="Correo electrónico"
                  value={formData.correo}
                  onChangeText={(text) => handleInputChange('correo', text)}
                  mode="outlined"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  left={<TextInput.Icon icon="email" color={colors.inputIcon} />}
                  style={[styles.input, { backgroundColor: colors.card }]}
                  outlineColor={errors.correo ? '#EF4444' : colors.inputBorder}
                  activeOutlineColor={errors.correo ? '#EF4444' : colors.inputBorderActive}
                  textColor={colors.text}
                  placeholderTextColor={colors.disabled}
                />
                {errors.correo && (
                  <HelperText type="error" visible={!!errors.correo}>
                    {errors.correo}
                  </HelperText>
                )}
              </View>

              {/* Teléfono */}
              <View style={styles.inputContainer}>
                <TextInput
                  label="Teléfono"
                  value={formData.telefono}
                  onChangeText={(text) => handleInputChange('telefono', text)}
                  mode="outlined"
                  keyboardType="phone-pad"
                  left={<TextInput.Icon icon="phone" color={colors.inputIcon} />}
                  style={[styles.input, { backgroundColor: colors.card }]}
                  outlineColor={errors.telefono ? '#EF4444' : colors.inputBorder}
                  activeOutlineColor={errors.telefono ? '#EF4444' : colors.inputBorderActive}
                  textColor={colors.text}
                  placeholderTextColor={colors.disabled}
                />
                {errors.telefono && (
                  <HelperText type="error" visible={!!errors.telefono}>
                    {errors.telefono}
                  </HelperText>
                )}
              </View>

              {/* Contraseña */}
              <View style={styles.inputContainer}>
                <TextInput
                  label="Contraseña"
                  value={formData.password_perfil}
                  onChangeText={(text) => handleInputChange('password_perfil', text)}
                  mode="outlined"
                  secureTextEntry={secureTextEntry}
                  autoCapitalize="none"
                  left={<TextInput.Icon icon="lock" color={colors.inputIcon} />}
                  right={
                    <TextInput.Icon
                      icon={secureTextEntry ? 'eye-off' : 'eye'}
                      color={colors.inputIcon}
                      onPress={() => setSecureTextEntry(!secureTextEntry)}
                    />
                  }
                  style={[styles.input, { backgroundColor: colors.card }]}
                  outlineColor={errors.password_perfil ? '#EF4444' : colors.inputBorder}
                  activeOutlineColor={errors.password_perfil ? '#EF4444' : colors.inputBorderActive}
                  textColor={colors.text}
                  placeholderTextColor={colors.disabled}
                />
                {errors.password_perfil && (
                  <HelperText type="error" visible={!!errors.password_perfil}>
                    {errors.password_perfil}
                  </HelperText>
                )}
              </View>

              {/* Confirmar Contraseña */}
              <View style={styles.inputContainer}>
                <TextInput
                  label="Confirmar contraseña"
                  value={formData.password_perfil2}
                  onChangeText={(text) => handleInputChange('password_perfil2', text)}
                  mode="outlined"
                  secureTextEntry={secureTextEntry2}
                  autoCapitalize="none"
                  left={<TextInput.Icon icon="lock-check" color={colors.inputIcon} />}
                  right={
                    <TextInput.Icon
                      icon={secureTextEntry2 ? 'eye-off' : 'eye'}
                      color={colors.inputIcon}
                      onPress={() => setSecureTextEntry2(!secureTextEntry2)}
                    />
                  }
                  style={[styles.input, { backgroundColor: colors.card }]}
                  outlineColor={errors.password_perfil2 ? '#EF4444' : colors.inputBorder}
                  activeOutlineColor={errors.password_perfil2 ? '#EF4444' : colors.inputBorderActive}
                  textColor={colors.text}
                  placeholderTextColor={colors.disabled}
                />
                {errors.password_perfil2 && (
                  <HelperText type="error" visible={!!errors.password_perfil2}>
                    {errors.password_perfil2}
                  </HelperText>
                )}
              </View>

              {/* Tipo de Negocio */}
              <View style={[styles.inputContainer, styles.radioContainer]}>
                <Text style={[styles.radioLabel, { color: colors.text }]}>
                  Tipo de negocio
                </Text>
                <RadioButton.Group
                  onValueChange={(value) => handleInputChange('tipo_negocio', value)}
                  value={formData.tipo_negocio}
                >
                  <View style={styles.radioGrid}>
                    {negocioOptions.map((option) => (
                      <View key={option.value} style={styles.radioItem}>
                        <RadioButton.Android
                          value={option.value}
                          color={colors.tint}
                          uncheckedColor={colors.border}
                        />
                        <Pressable onPress={() => handleInputChange('tipo_negocio', option.value)}>
                          <Text style={[styles.radioText, { color: colors.secondaryText }]}>
                            {option.label}
                          </Text>
                        </Pressable>
                      </View>
                    ))}
                  </View>
                </RadioButton.Group>
                {errors.tipo_negocio && (
                  <HelperText type="error" visible={!!errors.tipo_negocio}>
                    {errors.tipo_negocio}
                  </HelperText>
                )}
              </View>

              {/* Register Button */}
              <Button
                mode="contained"
                onPress={handleRegister}
                loading={loading}
                disabled={loading}
                style={[styles.registerButton, { backgroundColor: colors.tint }]}
                contentStyle={styles.buttonContent}
                labelStyle={styles.buttonLabel}
                buttonColor={colors.tint}
                textColor="#FFFFFF"
              >
                Crear Cuenta
              </Button>
            </View>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
              <Text style={[styles.dividerText, { color: colors.disabled }]}>o</Text>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            </View>

            {/* Login Link */}
            <Pressable onPress={() => router.back()}>
              <View style={styles.loginContainer}>
                <Text style={[styles.loginText, { color: colors.secondaryText }]}>
                  ¿Ya tienes cuenta?
                </Text>
                <Text style={[styles.loginLink, { color: colors.tint }]}>
                  {' '}Iniciar Sesión
                </Text>
              </View>
            </Pressable>
          </Card>

          {/* Footer */}
          <Text style={[styles.footer, { color: colors.disabled }]}>
            © 2026 RestaurantApp. Todos los derechos reservados.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  decorativeTop: {
    position: 'absolute',
    top: -100,
    left: -100,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#02dbb7',
    opacity: 0.05,
  },
  decorativeBottom: {
    position: 'absolute',
    bottom: -150,
    right: -150,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#02dbb7',
    opacity: 0.05,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  card: {
    borderRadius: 20,
    padding: 24,
    overflow: 'hidden',
  },
  cardShimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoContainer: {
    padding: 8,
    borderRadius: 50,
    marginBottom: 16,
  },
  logo: {
    elevation: 4,
    shadowColor: '#02dbb7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  formSection: {
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 12,
  },
  input: {
    fontSize: 16,
    height: 56,
  },
  helperText: {
    fontSize: 12,
    marginTop: -4,
  },
  radioContainer: {
    marginTop: 8,
    marginBottom: 20,
  },
  radioLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
  },
  radioGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: '45%',
  },
  radioText: {
    fontSize: 14,
    marginLeft: 4,
  },
  registerButton: {
    borderRadius: 12,
    marginTop: 8,
    elevation: 2,
    shadowColor: '#02dbb7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonContent: {
    height: 52,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 12,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    textAlign: 'center',
    marginTop: 24,
    fontSize: 11,
  },
});
