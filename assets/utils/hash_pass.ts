import bcrypt from 'bcryptjs';

// Crear un hash al registrar un usuario
export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10); // puedes usar 10–12 rondas
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

// Verificar contraseña al iniciar sesión
export const verifyPassword = async (password: string, hash: string) => {
  const isMatch = await bcrypt.compare(password, hash);
  return isMatch;
};
