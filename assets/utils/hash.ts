import CryptoJS from "crypto-js";

// Función para generar hash SHA256
export const hashPassword = (password: string): string => {
  return CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
};