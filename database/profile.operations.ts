import { uuid } from "@/assets/utils/uuid";
import { Perfil } from "@/interfaces/profile";
import * as SQLite from 'expo-sqlite';

// Types
type CreateProfileInput = Omit<Perfil, 'id_perfil' | 'uuid' | 'fecha_creacion'> & {
    uuid?: string;
};

type UpdateProfileInput = Partial<Omit<Perfil, 'id_perfil' | 'uuid' | 'fecha_creacion'>> & {
    id_perfil: number;
};

type ProfileFilter = {
    tipo_perfil?: string;
    estado?: string;
    id_negocio?: number;
    searchTerm?: string;
};

// Crear perfil
export const createProfile = async (
    db: SQLite.SQLiteDatabase,
    profile: CreateProfileInput
): Promise<number> => {
    // Validar campos requeridos
    if (!profile.correo || !profile.nombre_perfil || !profile.password_perfil || !profile.tipo_perfil) {
        throw new Error("❌ Campos requeridos faltantes: correo, nombre_perfil, password_perfil, tipo_perfil");
    }

    // Verificar si ya existe un perfil con el mismo correo
    const existingProfile = await getProfileByEmail(db, profile.correo);
    if (existingProfile) {
        throw new Error("❌ Ya existe un perfil con este correo electrónico");
    }

    const result = await db.runAsync(
        `INSERT INTO Perfil (
            id_usuario, id_negocio, uuid, correo, telefono, nombre_perfil, 
            password_perfil, tipo_perfil, tipo_negocio, estado, 
            valores_configuraciones, auth
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            profile.id_usuario,
            profile.id_negocio ?? null,
            profile.uuid || uuid(),
            profile.correo.toLowerCase().trim(),
            profile.telefono ? profile.telefono.trim() : null,
            profile.nombre_perfil.trim(),
            profile.password_perfil, // Asegúrate de hashear la contraseña antes de llamar a esta función
            profile.tipo_perfil,
            profile.tipo_negocio ?? null,
            profile.estado ?? 'activo',
            profile.valores_configuraciones ?? '{}',
            profile.auth ?? '{}',
        ]
    );
    
    return result.lastInsertRowId as number;
};

// Obtener perfil por ID
export const getProfileById = async (
    db: SQLite.SQLiteDatabase,
    id_perfil: number
): Promise<Perfil | null> => {
    const result = await db.getFirstAsync<Perfil>(
        `SELECT * FROM Perfil WHERE id_perfil = ?`,
        [id_perfil]
    );
    return result ?? null;
};

// Obtener perfil por UUID
export const getProfileByUuid = async (
    db: SQLite.SQLiteDatabase,
    uuid: string
): Promise<Perfil | null> => {
    const result = await db.getFirstAsync<Perfil>(
        `SELECT * FROM Perfil WHERE uuid = ?`,
        [uuid]
    );
    return result ?? null;
};

// Obtener perfil por correo electrónico (case-insensitive)
export const getProfileByEmail = async (
    db: SQLite.SQLiteDatabase,
    correo: string
): Promise<Perfil | null> => {
    const result = await db.getFirstAsync<Perfil>(
        `SELECT * FROM Perfil WHERE LOWER(correo) = LOWER(?)`,
        [correo.trim()]
    );
    return result ?? null;
};

// Obtener perfiles por ID de usuario
export const getProfilesByUserId = async (
    db: SQLite.SQLiteDatabase,
    id_usuario: number
): Promise<Perfil[]> => {
    const results = await db.getAllAsync<Perfil>(
        `SELECT * FROM Perfil WHERE id_usuario = ?`,
        [id_usuario]
    );
    return results;
};

// Buscar perfiles con filtros
export const searchProfiles = async (
    db: SQLite.SQLiteDatabase,
    filter: ProfileFilter = {},
    limit: number = 100,
    offset: number = 0
): Promise<Perfil[]> => {
    let query = "SELECT * FROM Perfil WHERE 1=1";
    const params: (string | number)[] = [];

    if (filter.tipo_perfil) {
        query += " AND tipo_perfil = ?";
        params.push(filter.tipo_perfil);
    }

    if (filter.estado) {
        query += " AND estado = ?";
        params.push(filter.estado);
    }

    if (filter.id_negocio !== undefined) {
        query += " AND id_negocio = ?";
        params.push(filter.id_negocio);
    }

    if (filter.searchTerm) {
        query += " AND (LOWER(nombre_perfil) LIKE ? OR LOWER(correo) LIKE ? OR telefono LIKE ?)";
        const searchTerm = `%${filter.searchTerm.toLowerCase()}%`;
        params.push(searchTerm, searchTerm, `%${filter.searchTerm}%`);
    }

    query += " ORDER BY nombre_perfil ASC LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const results = await db.getAllAsync<Perfil>(query, params);
    return results;
};

// Listar todos los perfiles (con paginación)
export const getAllProfiles = async (
    db: SQLite.SQLiteDatabase,
    limit: number = 100,
    offset: number = 0
): Promise<Perfil[]> => {
    return searchProfiles(db, {}, limit, offset);
};

// Actualizar perfil
export const updateProfile = async (
    db: SQLite.SQLiteDatabase,
    updateData: UpdateProfileInput
): Promise<boolean> => {
    const { id_perfil, ...updates } = updateData;
    
    if (!id_perfil) {
        throw new Error("❌ El perfil debe tener id_perfil para actualizar");
    }

    const existingProfile = await getProfileById(db, id_perfil);
    if (!existingProfile) {
        throw new Error("❌ No se encontró el perfil especificado");
    }

    // Verificar si se está actualizando el correo a uno que ya existe
    if (updates.correo && updates.correo !== existingProfile.correo) {
        const existingEmail = await getProfileByEmail(db, updates.correo);
        if (existingEmail && existingEmail.id_perfil !== id_perfil) {
            throw new Error("❌ Ya existe un perfil con este correo electrónico");
        }
    }

    const updateFields: string[] = [];
    const params: (string | number | null)[] = [];

    const fields: Array<keyof typeof updates> = [
        'id_usuario', 'id_negocio', 'correo', 'telefono', 'nombre_perfil',
        'password_perfil', 'tipo_perfil', 'tipo_negocio', 'estado',
        'valores_configuraciones', 'auth'
    ];

    fields.forEach(field => {
        if (field in updates) {
            updateFields.push(`${field} = ?`);
            // Aplicar formato a los campos según corresponda
            if (field === 'correo' && updates[field]) {
                params.push((updates[field] as string).toLowerCase().trim());
            } else if (field === 'telefono' && updates[field]) {
                params.push((updates[field] as string).trim());
            } else if (field === 'nombre_perfil' && updates[field]) {
                params.push((updates[field] as string).trim());
            } else {
                params.push(updates[field] ?? null);
            }
        }
    });

    if (updateFields.length === 0) {
        return false; // No hay nada que actualizar
    }

    params.push(id_perfil);

    const result = await db.runAsync(
        `UPDATE Perfil 
         SET ${updateFields.join(', ')}
         WHERE id_perfil = ?`,
        params
    );

    return result.changes > 0;
};

// Actualizar solo la contraseña de un perfil
export const updateProfilePassword = async (
    db: SQLite.SQLiteDatabase,
    id_perfil: number,
    newPassword: string
): Promise<boolean> => {
    const result = await db.runAsync(
        `UPDATE Perfil 
         SET password_perfil = ?
         WHERE id_perfil = ?`,
        [newPassword, id_perfil]
    );
    return result.changes > 0;
};

// Actualizar configuración de perfil
export const updateProfileSettings = async (
    db: SQLite.SQLiteDatabase,
    id_perfil: number,
    settings: Record<string, any>
): Promise<boolean> => {
    const result = await db.runAsync(
        `UPDATE Perfil 
         SET valores_configuraciones = ?
         WHERE id_perfil = ?`,
        [JSON.stringify(settings), id_perfil]
    );
    return result.changes > 0;
};

// Eliminar perfil
export const deleteProfile = async (
    db: SQLite.SQLiteDatabase,
    id_perfil: number
): Promise<boolean> => {
    const result = await db.runAsync(
        "DELETE FROM Perfil WHERE id_perfil = ?",
        [id_perfil]
    );
    return result.changes > 0;
};

// Desactivar perfil (cambiar estado a inactivo)
export const deactivateProfile = async (
    db: SQLite.SQLiteDatabase,
    id_perfil: number
): Promise<boolean> => {
    const result = await db.runAsync(
        `UPDATE Perfil 
         SET estado = 'inactivo'
         WHERE id_perfil = ?`,
        [id_perfil]
    );
    return result.changes > 0;
};

// Activar perfil (cambiar estado a activo)
export const activateProfile = async (
    db: SQLite.SQLiteDatabase,
    id_perfil: number
): Promise<boolean> => {
    const result = await db.runAsync(
        `UPDATE Perfil 
         SET estado = 'activo'
         WHERE id_perfil = ?`,
        [id_perfil]
    );
    return result.changes > 0;
};

// Verificar credenciales de inicio de sesión
export const verifyLoginCredentials = async (
    db: SQLite.SQLiteDatabase,
    correo: string,
    password: string
): Promise<Perfil | null> => {
    const profile = await getProfileByEmail(db, correo);
    
    if (!profile || profile.estado !== 'activo') {
        return null;
    }

    // Nota: En una aplicación real, deberías comparar hashes de contraseña, no texto plano
    // Esto es solo un ejemplo básico
    if (profile.password_perfil !== password) {
        return null;
    }

    return profile;
};

// Obtener estadísticas de perfiles
export const getProfileStatistics = async (
    db: SQLite.SQLiteDatabase,
    id_negocio?: number
) => {
    let whereClause = '';
    const params: number[] = [];
    
    if (id_negocio !== undefined) {
        whereClause = 'WHERE id_negocio = ?';
        params.push(id_negocio);
    }

    const [
        totalProfiles,
        activeProfiles,
        inactiveProfiles,
        adminProfiles,
        staffProfiles
    ] = await Promise.all([
        db.getFirstAsync<{ count: number }>(
            `SELECT COUNT(*) as count FROM Perfil ${whereClause}`,
            params
        ),
        db.getFirstAsync<{ count: number }>(
            `SELECT COUNT(*) as count FROM Perfil 
             WHERE estado = 'activo' ${id_negocio !== undefined ? 'AND id_negocio = ?' : ''}`,
            id_negocio !== undefined ? [id_negocio] : []
        ),
        db.getFirstAsync<{ count: number }>(
            `SELECT COUNT(*) as count FROM Perfil 
             WHERE estado = 'inactivo' ${id_negocio !== undefined ? 'AND id_negocio = ?' : ''}`,
            id_negocio !== undefined ? [id_negocio] : []
        ),
        db.getFirstAsync<{ count: number }>(
            `SELECT COUNT(*) as count FROM Perfil 
             WHERE tipo_perfil = 'admin' ${id_negocio !== undefined ? 'AND id_negocio = ?' : ''}`,
            id_negocio !== undefined ? [id_negocio] : []
        ),
        db.getFirstAsync<{ count: number }>(
            `SELECT COUNT(*) as count FROM Perfil 
             WHERE tipo_perfil = 'staff' ${id_negocio !== undefined ? 'AND id_negocio = ?' : ''}`,
            id_negocio !== undefined ? [id_negocio] : []
        )
    ]);

    return {
        total_profiles: totalProfiles?.count ?? 0,
        active_profiles: activeProfiles?.count ?? 0,
        inactive_profiles: inactiveProfiles?.count ?? 0,
        admin_profiles: adminProfiles?.count ?? 0,
        staff_profiles: staffProfiles?.count ?? 0,
    };
};
