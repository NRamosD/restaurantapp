import { uuid } from "@/assets/utils/uuid";
import { Auditoria } from "@/interfaces/audit";
import * as SQLite from 'expo-sqlite';

// Crear un nuevo registro de auditoría
export const createAuditLog = async (
    dbConnection: SQLite.SQLiteDatabase,
    auditData: Omit<Auditoria, 'uuid' | 'fecha_creacion'>
): Promise<void> => {
    await dbConnection.runAsync(
        `INSERT INTO Auditoria (
            uuid, tabla_afectada, operacion, id_perfil, 
            cambio_anterior, detalle, fecha_creacion
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
            uuid(),
            auditData.tabla_afectada,
            auditData.operacion,
            auditData.id_perfil ?? null,
            auditData.cambio_anterior ?? null,
            auditData.detalle ?? null,
            new Date().toISOString()
        ]
    );
};

// Obtener registros de auditoría por tabla
export const getAuditLogsByTable = async (
    db: SQLite.SQLiteDatabase,
    tabla: string,
    limit: number = 100,
    offset: number = 0
): Promise<Auditoria[]> => {
    const results = await db.getAllAsync<Auditoria>(
        `SELECT * FROM Auditoria 
         WHERE tabla_afectada = ? 
         ORDER BY fecha_creacion DESC
         LIMIT ? OFFSET ?`,
        [tabla, limit, offset]
    );
    return results;
};

// Obtener registros de auditoría por tipo de operación
export const getAuditLogsByOperation = async (
    db: SQLite.SQLiteDatabase,
    operacion: "CREATE" | "INSERT" | "UPDATE" | "DELETE",
    limit: number = 100,
    offset: number = 0
): Promise<Auditoria[]> => {
    const results = await db.getAllAsync<Auditoria>(
        `SELECT * FROM Auditoria 
         WHERE operacion = ? 
         ORDER BY fecha_creacion DESC
         LIMIT ? OFFSET ?`,
        [operacion, limit, offset]
    );
    return results;
};

// Obtener registros de auditoría por perfil
export const getAuditLogsByProfile = async (
    db: SQLite.SQLiteDatabase,
    id_perfil: number,
    limit: number = 100,
    offset: number = 0
): Promise<Auditoria[]> => {
    const results = await db.getAllAsync<Auditoria>(
        `SELECT * FROM Auditoria 
         WHERE id_perfil = ? 
         ORDER BY fecha_creacion DESC
         LIMIT ? OFFSET ?`,
        [id_perfil, limit, offset]
    );
    return results;
};

// Obtener registros de auditoría por rango de fechas
export const getAuditLogsByDateRange = async (
    db: SQLite.SQLiteDatabase,
    startDate: string,
    endDate: string,
    limit: number = 100,
    offset: number = 0
): Promise<Auditoria[]> => {
    const results = await db.getAllAsync<Auditoria>(
        `SELECT * FROM Auditoria 
         WHERE fecha_creacion BETWEEN ? AND ? 
         ORDER BY fecha_creacion DESC
         LIMIT ? OFFSET ?`,
        [startDate, endDate, limit, offset]
    );
    return results;
};

// Buscar en registros de auditoría por texto
export const searchAuditLogs = async (
    db: SQLite.SQLiteDatabase,
    searchTerm: string,
    limit: number = 100,
    offset: number = 0
): Promise<Auditoria[]> => {
    const searchPattern = `%${searchTerm}%`;
    const results = await db.getAllAsync<Auditoria>(
        `SELECT * FROM Auditoria 
         WHERE tabla_afectada LIKE ? 
            OR detalle LIKE ? 
            OR cambio_anterior LIKE ?
         ORDER BY fecha_creacion DESC
         LIMIT ? OFFSET ?`,
        [searchPattern, searchPattern, searchPattern, limit, offset]
    );
    return results;
};

// Obtener estadísticas de auditoría
export const getAuditStatistics = async (
    db: SQLite.SQLiteDatabase
): Promise<{
    total: number;
    byOperation: Record<string, number>;
    byTable: Record<string, number>;
    recentActivity: Auditoria[];
}> => {
    const [total, operations, tables, recent] = await Promise.all([
        db.getFirstAsync<{ count: number }>("SELECT COUNT(*) as count FROM Auditoria"),
        db.getAllAsync<{ operacion: string; count: number }>(
            "SELECT operacion, COUNT(*) as count FROM Auditoria GROUP BY operacion"
        ),
        db.getAllAsync<{ tabla_afectada: string; count: number }>(
            "SELECT tabla_afectada, COUNT(*) as count FROM Auditoria GROUP BY tabla_afectada"
        ),
        db.getAllAsync<Auditoria>(
            "SELECT * FROM Auditoria ORDER BY fecha_creacion DESC LIMIT 10"
        )
    ]);

    // Convertir los resultados a objetos
    const byOperation: Record<string, number> = {};
    operations.forEach(op => {
        byOperation[op.operacion] = op.count;
    });

    const byTable: Record<string, number> = {};
    tables.forEach(table => {
        byTable[table.tabla_afectada] = table.count;
    });

    return {
        total: total?.count ?? 0,
        byOperation,
        byTable,
        recentActivity: recent
    };
};