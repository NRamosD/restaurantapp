import { uuid } from "@/assets/utils/uuid";
import { Componente } from "@/interfaces/components";
import * as SQLite from 'expo-sqlite';

// Crear un nuevo componente
export const createComponent = async (
    dbConnection: SQLite.SQLiteDatabase,
    componente: Omit<Componente, 'id_componente' | 'uuid' | 'fecha_creacion'>
  ): Promise<number> => {
    const result = await dbConnection.runAsync(
      `INSERT INTO Componentes (
        id_perfil, uuid, nombre, descripcion, tipo, material, peso, longitud,
        ancho, alto, calorias, stock, porciones, color, fecha_creacion
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        componente.id_perfil, // 🔹 este es obligatorio
        uuid(),
        componente.nombre,
        componente.descripcion ?? null,
        componente.tipo ?? null,
        componente.material ?? null,
        componente.peso ?? null,
        componente.longitud ?? null,
        componente.ancho ?? null,
        componente.alto ?? null,
        componente.calorias ?? null,
        componente.stock ?? 0,
        componente.porciones ?? null,
        componente.color ?? null,
        new Date().toISOString()
      ]
    );
  
    return result.lastInsertRowId as number;
};
  

// Obtener componente por ID
export const getComponentById = async (
    db: SQLite.SQLiteDatabase,
    id_componente: number
): Promise<Componente | null> => {
    const result = await db.getFirstAsync<Componente>(
        `SELECT * FROM Componentes WHERE id_componente = ?`,
        [id_componente]
    );
    return result ?? null;
};

// Obtener componentes por UUID
export const getComponentByUuid = async (
    db: SQLite.SQLiteDatabase,
    uuid: string
): Promise<Componente | null> => {
    const result = await db.getFirstAsync<Componente>(
        `SELECT * FROM Componentes WHERE uuid = ?`,
        [uuid]
    );
    return result ?? null;
};

// Obtener todos los componentes
export const getAllComponents = async (
    db: SQLite.SQLiteDatabase,
    limit: number = 100,
    offset: number = 0
): Promise<Componente[]> => {
    const results = await db.getAllAsync<Componente>(
        `SELECT * FROM Componentes 
         ORDER BY nombre ASC
         LIMIT ? OFFSET ?`,
        [limit, offset]
    );
    return results;
};

// Buscar componentes por nombre
export const searchComponents = async (
    db: SQLite.SQLiteDatabase,
    searchTerm: string,
    limit: number = 50
): Promise<Componente[]> => {
    const results = await db.getAllAsync<Componente>(
        `SELECT * FROM Componentes 
         WHERE nombre LIKE ? 
         ORDER BY nombre ASC
         LIMIT ?`,
        [`%${searchTerm}%`, limit]
    );
    return results;
};

// Actualizar componente
export const updateComponent = async (
    db: SQLite.SQLiteDatabase,
    componente: Componente
) => {
    if (!componente.id_componente) {
        throw new Error("❌ El componentes debe tener un id_componente para actualizar");
    }

    await db.runAsync(
        `UPDATE Componentes SET
            nombre = ?,
            descripcion = ?,
            tipo = ?,
            material = ?,
            peso = ?,
            longitud = ?,
            ancho = ?,
            alto = ?,
            calorias = ?,
            stock = ?,
            porciones = ?,
            color = ?
        WHERE id_componente = ?`,
        [
            componente.nombre,
            componente.descripcion ?? null,
            componente.tipo ?? null,
            componente.material ?? null,
            componente.peso ?? null,
            componente.longitud ?? null,
            componente.ancho ?? null,
            componente.alto ?? null,
            componente.calorias ?? null,
            componente.stock ?? 0,
            componente.porciones ?? null,
            componente.color ?? null,
            componente.id_componente
        ]
    );
};

// Actualizar stock de un componente
export const updateComponentStock = async (
    db: SQLite.SQLiteDatabase,
    id_componente: number,
    cantidad: number
) => {
    await db.runAsync(
        `UPDATE Componentes 
         SET stock = stock + ? 
         WHERE id_componente = ?`,
        [cantidad, id_componente]
    );
};

// Eliminar componente
export const deleteComponent = async (
    db: SQLite.SQLiteDatabase,
    id_componente: number
) => {
    await db.runAsync(
        "DELETE FROM Componentes WHERE id_componente = ?",
        [id_componente]
    );
};

// Obtener componentes por tipo
export const getComponentsByType = async (
    db: SQLite.SQLiteDatabase,
    tipo: string,
    limit: number = 100,
    offset: number = 0
): Promise<Componente[]> => {
    const results = await db.getAllAsync<Componente>(
        `SELECT * FROM Componentes 
         WHERE tipo = ? 
         ORDER BY nombre ASC
         LIMIT ? OFFSET ?`,
        [tipo, limit, offset]
    );
    return results;
};

// Obtener componentes con bajo stock
export const getLowStockComponents = async (
    db: SQLite.SQLiteDatabase,
    threshold: number = 5
): Promise<Componente[]> => {
    const results = await db.getAllAsync<Componente>(
        `SELECT * FROM Componentes 
         WHERE stock <= ? 
         ORDER BY stock ASC, nombre ASC`,
        [threshold]
    );
    return results;
};

// Obtener estadísticas de componentes
export const getComponentStatistics = async (
    db: SQLite.SQLiteDatabase
): Promise<{
    totalComponentes: number;
    totalStock: number;
    componentesPorTipo: Record<string, number>;
    stockPorTipo: Record<string, number>;
}> => {
    const [total, tipos, stockPorTipo] = await Promise.all([
        db.getFirstAsync<{ count: number; total: number }>(
            `SELECT 
                COUNT(*) as count,
                SUM(stock) as total
             FROM Componentes`
        ),
        db.getAllAsync<{ tipo: string; count: number }>(
            `SELECT 
                COALESCE(tipo, 'Sin tipo') as tipo, 
                COUNT(*) as count 
             FROM Componentes
             GROUP BY tipo`
        ),
        db.getAllAsync<{ tipo: string; total: number }>(
            `SELECT 
                COALESCE(tipo, 'Sin tipo') as tipo, 
                SUM(stock) as total
             FROM Componentes
             GROUP BY tipo`
        )
    ]);

    const componentesPorTipo: Record<string, number> = {};
    const stockPorTipoObj: Record<string, number> = {};

    tipos.forEach(t => {
        componentesPorTipo[t.tipo] = t.count;
    });

    stockPorTipo.forEach(s => {
        stockPorTipoObj[s.tipo] = s.total || 0;
    });

    return {
        totalComponentes: total?.count || 0,
        totalStock: total?.total || 0,
        componentesPorTipo,
        stockPorTipo: stockPorTipoObj
    };
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
