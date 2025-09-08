import { uuid } from "@/assets/utils/uuid";
import { Orden } from "@/interfaces/orders";
import * as SQLite from 'expo-sqlite';

// Crear una nueva orden
export const createOrder = async (
    dbConnection: SQLite.SQLiteDatabase,
    order: Orden
): Promise<number> => {
    const result = await dbConnection.runAsync(
        `INSERT INTO Ordenes (
            id_perfil, uuid, fecha, estado, total
        ) VALUES (?, ?, ?, ?, ?)`,
        [
            order.id_perfil,
            uuid(),
            new Date().toISOString(),
            order.estado ?? "pendiente",
            order.total
        ]
    );
    return result.lastInsertRowId as number;
};

// Obtener orden por ID
export const getOrderById = async (
    db: SQLite.SQLiteDatabase,
    id_orden: number
): Promise<Orden | null> => {
    const result = await db.getFirstAsync<Orden>(
        "SELECT * FROM Ordenes WHERE id_orden = ?",
        [id_orden]
    );
    return result ?? null;
};

// Obtener todas las órdenes de un perfil
export const getOrdersByProfileId = async (
    db: SQLite.SQLiteDatabase,
    id_perfil: number
): Promise<Orden[]> => {
    const results = await db.getAllAsync<Orden>(
        "SELECT * FROM Ordenes WHERE id_perfil = ? ORDER BY fecha DESC",
        [id_perfil]
    );
    return results;
};

// Actualizar una orden
export const updateOrder = async (
    db: SQLite.SQLiteDatabase,
    order: Orden
) => {
    if (!order.id_orden) {
        throw new Error("❌ La orden debe tener un id_orden para actualizar");
    }

    await db.runAsync(
        `UPDATE Ordenes SET
            estado = ?,
            total = ?
        WHERE id_orden = ?`,
        [
            order.estado ?? "pendiente",
            order.total,
            order.id_orden
        ]
    );
};

// Actualizar solo el estado de una orden
export const updateOrderStatus = async (
    db: SQLite.SQLiteDatabase,
    id_orden: number,
    estado: "pendiente" | "pagado" | "cancelado"
) => {
    await db.runAsync(
        "UPDATE Ordenes SET estado = ? WHERE id_orden = ?",
        [estado, id_orden]
    );
};

// Eliminar una orden
export const deleteOrder = async (
    db: SQLite.SQLiteDatabase,
    id_orden: number
) => {
    // Primero eliminamos los productos asociados a la orden
    await db.runAsync(
        "DELETE FROM Orden_Producto WHERE id_orden = ?",
        [id_orden]
    );
    
    // Luego eliminamos la orden
    await db.runAsync(
        "DELETE FROM Ordenes WHERE id_orden = ?",
        [id_orden]
    );
};

// Obtener órdenes por estado
export const getOrdersByStatus = async (
    db: SQLite.SQLiteDatabase,
    estado: "pendiente" | "pagado" | "cancelado"
): Promise<Orden[]> => {
    const results = await db.getAllAsync<Orden>(
        "SELECT * FROM Ordenes WHERE estado = ? ORDER BY fecha DESC",
        [estado]
    );
    return results;
};

// Obtener el total de ventas
export const getTotalSales = async (
    db: SQLite.SQLiteDatabase
): Promise<number> => {
    const result = await db.getFirstAsync<{ total: number }>(
        "SELECT COALESCE(SUM(total), 0) as total FROM Ordenes WHERE estado = 'pagado'"
    );
    return result?.total ?? 0;
};

// Obtener estadísticas de órdenes
export const getOrderStatistics = async (
    db: SQLite.SQLiteDatabase
): Promise<{
    total: number;
    pendientes: number;
    pagadas: number;
    canceladas: number;
}> => {
    const [total, pendientes, pagadas, canceladas] = await Promise.all([
        db.getFirstAsync<{ count: number }>("SELECT COUNT(*) as count FROM Ordenes"),
        db.getFirstAsync<{ count: number }>("SELECT COUNT(*) as count FROM Ordenes WHERE estado = 'pendiente'"),
        db.getFirstAsync<{ count: number }>("SELECT COUNT(*) as count FROM Ordenes WHERE estado = 'pagado'"),
        db.getFirstAsync<{ count: number }>("SELECT COUNT(*) as count FROM Ordenes WHERE estado = 'cancelado'")
    ]);

    return {
        total: total?.count ?? 0,
        pendientes: pendientes?.count ?? 0,
        pagadas: pagadas?.count ?? 0,
        canceladas: canceladas?.count ?? 0
    };
};