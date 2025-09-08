
import { Perfil } from "@/interfaces/profile";
import * as SQLite from 'expo-sqlite';

export const getAllProfiles = async (
    db: SQLite.SQLiteDatabase
): Promise<Perfil[]> => {
    const results = await db.getAllAsync<Perfil>("SELECT * FROM Perfil");
    return results;
};

// // Crear perfil
// export const createProfile = async (dbConnection: SQLite.SQLiteDatabase, profile: Perfil) => {
//     await dbConnection.runAsync(
//         `INSERT INTO Perfil (
//           id_usuario, id_negocio, uuid, correo, telefono, nombre_perfil, 
//           password_perfil, tipo_perfil, tipo_negocio, estado, 
//           valores_configuraciones, auth, fecha_creacion
//         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//         [
//             profile.id_usuario,
//             profile.id_negocio ?? null,
//             uuid(),
//             profile.correo,
//             profile.telefono ?? null,
//             profile.nombre_perfil,
//             profile.password_perfil,
//             profile.tipo_perfil,
//             profile.tipo_negocio ?? null,
//             profile.estado ?? "activo",
//             profile.valores_configuraciones,
//             profile.auth,
//             new Date().toISOString()
//         ]
//     );
// };

// // Obtener perfil por ID
// export const getProfileById = async (
//     db: SQLite.SQLiteDatabase,
//     id_perfil: number
// ): Promise<Perfil | null> => {
//     const result = await db.getFirstAsync<Perfil>(
//         "SELECT * FROM Perfil WHERE id_perfil = ?",
//         [id_perfil]
//     );
//     return result ?? null;
// };

// // Obtener perfil por correo
// export const getProfileByEmail = async (
//     db: SQLite.SQLiteDatabase,
//     correo: string
// ): Promise<Perfil | null> => {
//     const result = await db.getFirstAsync<Perfil>(
//         "SELECT * FROM Perfil WHERE correo = ?",
//         [correo]
//     );
//     return result ?? null;
// };

// Listar todos los perfiles


// Actualizar perfil
// export const updateProfile = async (
//     db: SQLite.SQLiteDatabase,
//     profile: Perfil
// ) => {
//     if (!profile.id_perfil) {
//         throw new Error("❌ El perfil debe tener id_perfil para actualizar");
//     }

//     await db.runAsync(
//         `UPDATE Perfil SET
//             id_usuario = ?, id_negocio = ?, correo = ?, telefono = ?, 
//             nombre_perfil = ?, password_perfil = ?, tipo_perfil = ?, 
//             tipo_negocio = ?, estado = ?, valores_configuraciones = ?, 
//             auth = ?
//         WHERE id_perfil = ?`,
//         [
//             profile.id_usuario,
//             profile.id_negocio ?? null,
//             profile.correo,
//             profile.telefono ?? null,
//             profile.nombre_perfil,
//             profile.password_perfil,
//             profile.tipo_perfil,
//             profile.tipo_negocio ?? null,
//             profile.estado ?? "activo",
//             profile.valores_configuraciones,
//             profile.auth,
//             profile.id_perfil
//         ]
//     );
// };

// // Eliminar perfil
// export const deleteProfile = async (
//     db: SQLite.SQLiteDatabase,
//     id_perfil: number
// ) => {
//     await db.runAsync("DELETE FROM Perfil WHERE id_perfil = ?", [id_perfil]);
// };
