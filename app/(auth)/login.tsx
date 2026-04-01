import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
} from 'react-native';
import { Text, TextInput, Button, Card, Avatar, HelperText } from 'react-native-paper';
import { router } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors, getColors } from '@/constants/Colors';
import { useDrizzle } from '@/db/db';
import { eq } from 'drizzle-orm';
import { Usuario } from '@/db/schema';
import { verifyPassword } from '@/assets/utils/hash_pass';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useUsuarioService } from '@/modules';

type Props = {};

export default function LoginScreen({}: Props) {
  const colorScheme = useColorScheme();
  const colors = getColors(colorScheme);
  const db = useDrizzle();
  const { login } = useAuthStore();
  
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { validarCredenciales } = useUsuarioService()

  const handleLogin = async () => {
    if (!user.trim() || !pass.trim()) {
      setError('Por favor completa todos los campos');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {

      const resultado = await validarCredenciales({
        email: user.toLowerCase().trim(),
        passwordHash: pass,
      });
      console.log("Resultado de validar credenciales:", resultado);
      // if (!resultado) {
      //   setError('Credenciales incorrectas');
      //   setLoading(false);
      //   return;
      // }
      router.replace('/(tabs)');
      
      // const usuario = await db
      //   .select()
      //   .from(Usuario)
      //   .where(eq(Usuario.email, user.toLowerCase().trim()))
      //   .limit(1);

      //   console.log("Usuario encontrado:", usuario);
      // if (usuario.length === 0) {
      //   setError('Credenciales incorrectas');
      //   setLoading(false);
      //   return;
      // }

      // const userData = usuario[0];

      // if (!userData.activo) {
      //   setError('Usuario desactivado');
      //   setLoading(false);
      //   return;
      // }

      // const isValidPassword = await verifyPassword(pass, userData.passwordHash);
      

      // if (!isValidPassword) {
      //   setError('Credenciales incorrectas');
      //   setLoading(false);
      //   return;
      // }

      // await login({
      //   id_perfil: userData.id.toString(),
      //   nombre_perfil: userData.nombre,
      //   correo: userData.email,
      //   id_negocio: userData.perfilNegocioId.toString(),
      //   rol: userData.rol,
      // });

    } catch (err) {
      console.error('Error en login:', err);
      setError('Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

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
            {/* Card shimmer effect overlay */}
            <View style={[styles.cardShimmer, { backgroundColor: colors.cardGradientEnd }]} />
            
            {/* Logo and Branding */}
            <View style={styles.headerSection}>
              <View style={[styles.logoContainer, { backgroundColor: colors.tint + '15' }]}>
                <Avatar.Icon
                  size={80}
                  icon="silverware-fork-knife"
                  style={[styles.logo, { backgroundColor: colors.tint }]}
                  color="#FFFFFF"
                />
              </View>
              <Text style={[styles.title, { color: colors.text }]}>
                RestaurantApp
              </Text>
              <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
                Inicia sesión para continuar
              </Text>
            </View>

            {/* Form Section */}
            <View style={styles.formSection}>
              {/* Username Input */}
              <View style={styles.inputContainer}>
                <TextInput
                  label="Usuario o Correo"
                  value={user}
                  onChangeText={(text) => {
                    setUser(text);
                    setError('');
                  }}
                  mode="outlined"
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  left={<TextInput.Icon icon="account" color={colors.inputIcon} />}
                  style={[styles.input, { backgroundColor: colors.card }]}
                  outlineColor={colors.inputBorder}
                  activeOutlineColor={colors.inputBorderActive}
                  textColor={colors.text}
                  placeholderTextColor={colors.disabled}
                />
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <TextInput
                  label="Contraseña"
                  value={pass}
                  onChangeText={(text) => {
                    setPass(text);
                    setError('');
                  }}
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
                  outlineColor={error ? '#EF4444' : colors.inputBorder}
                  activeOutlineColor={error ? '#EF4444' : colors.inputBorderActive}
                  textColor={colors.text}
                  placeholderTextColor={colors.disabled}
                />
              </View>

              {/* Error Message */}
              {error ? (
                <HelperText type="error" visible={!!error} style={styles.helperText}>
                  {error}
                </HelperText>
              ) : null}

              {/* Login Button */}
              <Button
                mode="contained"
                onPress={handleLogin}
                loading={loading}
                disabled={loading}
                style={[styles.loginButton, { backgroundColor: colors.tint }]}
                contentStyle={styles.buttonContent}
                labelStyle={styles.buttonLabel}
                buttonColor={colors.tint}
                textColor="#FFFFFF"
              >
                Iniciar Sesión
              </Button>
            </View>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
              <Text style={[styles.dividerText, { color: colors.disabled }]}>o</Text>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            </View>

            {/* Free Version Option */}
            <Pressable onPress={() => router.push('/(auth)/register')}>
              <View style={[styles.freeVersionContainer, { backgroundColor: colors.tint + '10' }]}>
                <Text style={[styles.freeVersionIcon]}>✨</Text>
                <View style={styles.freeVersionTextContainer}>
                  <Text style={[styles.freeVersionTitle, { color: colors.text }]}>
                    Versión Gratuita
                  </Text>
                  <Text style={[styles.freeVersionSubtitle, { color: colors.secondaryText }]}>
                    Crea tu cuenta sin costo
                  </Text>
                </View>
                <Text style={[styles.arrowIcon, { color: colors.tint }]}>→</Text>
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
    right: -100,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#02dbb7',
    opacity: 0.05,
  },
  decorativeBottom: {
    position: 'absolute',
    bottom: -150,
    left: -150,
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
    justifyContent: 'center',
    padding: 20,
    paddingTop: 40,
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
    marginBottom: 32,
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
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  formSection: {
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    fontSize: 16,
    height: 56,
  },
  helperText: {
    fontSize: 12,
    marginBottom: 8,
    marginTop: -8,
  },
  loginButton: {
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
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 12,
  },
  freeVersionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  freeVersionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  freeVersionTextContainer: {
    flex: 1,
  },
  freeVersionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  freeVersionSubtitle: {
    fontSize: 12,
  },
  arrowIcon: {
    fontSize: 20,
    fontWeight: '600',
  },
  footer: {
    textAlign: 'center',
    marginTop: 24,
    fontSize: 11,
  },
});
