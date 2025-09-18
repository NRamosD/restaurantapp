import { uuid } from "@/assets/utils/uuid";
import { Orden } from "@/interfaces/orders";
import * as SQLite from 'expo-sqlite';

// Crear una nueva orden
export const createOrder = async (
    dbConnection: SQLite.SQLiteDatabase,
    order: Omit<Orden, 'id_orden' | 'uuid' | 'fecha'> & { fecha?: string }
): Promise<number> => {
    const result = await dbConnection.runAsync(
        `INSERT INTO Ordenes (
            id_perfil, uuid, fecha, estado, total
        ) VALUES (?, ?, ?, ?, ?)`,
        [
            order.id_perfil,
            uuid(),
            order.fecha || new Date().toISOString(),
            order.estado ?? 'pendiente',
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
        `SELECT 
            id_orden, 
            id_perfil, 
            uuid, 
            fecha, 
            estado, 
            total 
        FROM Ordenes WHERE id_orden = ?`,
        [id_orden]
    );
    return result ?? null;
};

// Obtener orden por UUID
export const getOrderByUuid = async (
    db: SQLite.SQLiteDatabase,
    uuid: string
): Promise<Orden | null> => {
    const result = await db.getFirstAsync<Orden>(
        `SELECT 
            id_orden, 
            id_perfil, 
            uuid, 
            fecha, 
            estado, 
            total 
        FROM Ordenes WHERE uuid = ?`,
        [uuid]
    );
    return result ?? null;
};

// Obtener todas las órdenes de un perfil
export const getOrdersByProfileId = async (
    db: SQLite.SQLiteDatabase,
    id_perfil: number,
    limit: number = 100,
    offset: number = 0
): Promise<Orden[]> => {
    const results = await db.getAllAsync<Orden>(
        `SELECT 
            id_orden, 
            id_perfil, 
            uuid, 
            fecha, 
            estado, 
            total 
        FROM Ordenes 
        WHERE id_perfil = ? 
        ORDER BY fecha DESC
        LIMIT ? OFFSET ?`,
        [id_perfil, limit, offset]
    );
    return results;
};

// Obtener órdenes por rango de fechas
export const getOrdersByDateRange = async (
    db: SQLite.SQLiteDatabase,
    startDate: string,
    endDate: string,
    id_perfil?: number
): Promise<Orden[]> => {
    let query = `
        SELECT 
            id_orden, 
            id_perfil, 
            uuid, 
            fecha, 
            estado, 
            total 
        FROM Ordenes 
        WHERE fecha BETWEEN ? AND ?
    `;
    
    const params: (string | number)[] = [startDate, endDate];
    
    if (id_perfil) {
        query += ' AND id_perfil = ?';
        params.push(id_perfil);
    }
    
    query += ' ORDER BY fecha DESC';
    
    const results = await db.getAllAsync<Orden>(query, params);
    return results;
};

// Actualizar una orden
export const updateOrder = async (
    db: SQLite.SQLiteDatabase,
    order: Orden
): Promise<void> => {
    if (!order.id_orden) {
        throw new Error("❌ La orden debe tener un id_orden para actualizar");
    }

    await db.runAsync(
        `UPDATE Ordenes SET
            id_perfil = ?,
            estado = ?,
            total = ?,
            fecha = ?
        WHERE id_orden = ?`,
        [
            order.id_perfil,
            order.estado ?? 'pendiente',
            order.total,
            order.fecha || new Date().toISOString(),
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
    estado: "pendiente" | "pagado" | "cancelado",
    id_perfil?: number,
    limit: number = 100,
    offset: number = 0
): Promise<Orden[]> => {
    let query = `
        SELECT 
            id_orden, 
            id_perfil, 
            uuid, 
            fecha, 
            estado, 
            total 
        FROM Ordenes 
        WHERE estado = ?
    `;
    
    const params: (string | number)[] = [estado];
    
    if (id_perfil) {
        query += ' AND id_perfil = ?';
        params.push(id_perfil);
    }
    
    query += ' ORDER BY fecha DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);
    
    const results = await db.getAllAsync<Orden>(query, params);
    return results;
};

// Obtener todas las órdenes con paginación
export const getAllOrders = async (
    db: SQLite.SQLiteDatabase,
    limit: number = 100,
    offset: number = 0
): Promise<Orden[]> => {
    const results = await db.getAllAsync<Orden>(
        `SELECT 
            id_orden, 
            id_perfil, 
            uuid, 
            fecha, 
            estado, 
            total 
        FROM Ordenes 
        ORDER BY fecha DESC
        LIMIT ? OFFSET ?`,
        [limit, offset]
    );
    return results;
};

// Obtener el total de ventas
export const getTotalSales = async (
    db: SQLite.SQLiteDatabase,
    id_perfil?: number,
    startDate?: string,
    endDate?: string
): Promise<number> => {
    let query = "SELECT COALESCE(SUM(total), 0) as total FROM Ordenes WHERE estado = 'pagado'";
    const params: (string | number)[] = [];
    
    if (id_perfil) {
        query += ' AND id_perfil = ?';
        params.push(id_perfil);
    }
    
    if (startDate && endDate) {
        query += ' AND fecha BETWEEN ? AND ?';
        params.push(startDate, endDate);
    }
    
    const result = await db.getFirstAsync<{ total: number }>(query, params);
    return result?.total ?? 0;
};

// Obtener estadísticas de ventas por período
export const getSalesStatistics = async (
    db: SQLite.SQLiteDatabase,
    period: 'day' | 'week' | 'month' | 'year',
    id_perfil?: number
) => {
    let dateFormat = '';
    
    switch (period) {
        case 'day':
            dateFormat = '%Y-%m-%d';
            break;
        case 'week':
            dateFormat = '%Y-%W';
            break;
        case 'month':
            dateFormat = '%Y-%m';
            break;
        case 'year':
            dateFormat = '%Y';
            break;
    }
    
    let query = `
        SELECT 
            strftime(?, fecha) as period,
            COUNT(*) as order_count,
            SUM(total) as total_sales
        FROM Ordenes
        WHERE estado = 'pagado'
    `;
    
    const params: string[] = [dateFormat];
    
    if (id_perfil) {
        query += ' AND id_perfil = ?';
        params.push(id_perfil.toString());
    }
    
    query += ' GROUP BY period ORDER BY period';
    
    return await db.getAllAsync<{
        period: string;
        order_count: number;
        total_sales: number;
    }>(query, params);
};

// Obtener estadísticas de órdenes
export const getOrderStatistics = async (
    db: SQLite.SQLiteDatabase,
    id_perfil?: number
): Promise<{
    total: number;
    pendientes: number;
    pagadas: number;
    canceladas: number;
    total_sales: number;
    average_order_value: number;
}> => {
    let whereClause = '';
    const params: (string | number)[] = [];
    
    if (id_perfil) {
        whereClause = 'WHERE id_perfil = ?';
        params.push(id_perfil);
    }
    
    const [
        total,
        pendientes,
        pagadas,
        canceladas,
        sales
    ] = await Promise.all([
        db.getFirstAsync<{ count: number }>(
            `SELECT COUNT(*) as count FROM Ordenes ${whereClause}`,
            params
        ),
        db.getFirstAsync<{ count: number }>(
            `SELECT COUNT(*) as count FROM Ordenes WHERE estado = 'pendiente' ${id_perfil ? 'AND id_perfil = ?' : ''}`,
            id_perfil ? [id_perfil] : []
        ),
        db.getFirstAsync<{ count: number }>(
            `SELECT COUNT(*) as count FROM Ordenes WHERE estado = 'pagado' ${id_perfil ? 'AND id_perfil = ?' : ''}`,
            id_perfil ? [id_perfil] : []
        ),
        db.getFirstAsync<{ count: number }>(
            `SELECT COUNT(*) as count FROM Ordenes WHERE estado = 'cancelado' ${id_perfil ? 'AND id_perfil = ?' : ''}`,
            id_perfil ? [id_perfil] : []
        ),
        db.getFirstAsync<{ total: number; avg: number }>(
            `SELECT 
                COALESCE(SUM(total), 0) as total,
                COALESCE(AVG(total), 0) as avg
             FROM Ordenes 
             WHERE estado = 'pagado' ${id_perfil ? 'AND id_perfil = ?' : ''}`,
            id_perfil ? [id_perfil] : []
        )
    ]);

    return {
        total: total?.count ?? 0,
        pendientes: pendientes?.count ?? 0,
        pagadas: pagadas?.count ?? 0,
        canceladas: canceladas?.count ?? 0,
        total_sales: sales?.total ?? 0,
        average_order_value: sales?.avg ?? 0
    };
};

// Obtener órdenes agrupadas por día (con filtro opcional por fecha específica)
export const getOrdersGroupedByDayStats = async (
    db: SQLite.SQLiteDatabase,
    id_perfil: number,
    date?: string
): Promise<Array<{ day: string; order_count: number; total_sales: number }>> => {
    let query = `
      SELECT 
        strftime('%Y-%m-%d', fecha) as day,
        COUNT(*) as order_count,
        COALESCE(SUM(total), 0) as total_sales
      FROM Ordenes
      WHERE id_perfil = ?
    `;

  
    const params: (string | number)[] = [id_perfil];
  
    if (date) {
      // Admite 'YYYY-MM-DD' o ISO; date() normaliza a solo la parte de fecha
      query += ` AND date(fecha) = date(?)`;
      params.push(date);
    }
  
    query += ` GROUP BY day ORDER BY day DESC`;
  
    return await db.getAllAsync<{ day: string; order_count: number; total_sales: number; orders: Orden[] }>(query, params);
};



// Obtener órdenes agrupadas por día (con filtro opcional por fecha específica)
export const getOrdersByDate = async (
    db: SQLite.SQLiteDatabase,
    id_perfil: number,
    type: 'day' | 'week' | 'month' | 'year',
    date1: string,
    date2?: string
): Promise<Array<Orden[]>> => {
    let query = '';
    const params: (string | number)[] = [id_perfil];

    if(type === 'day') {
        query = `
          SELECT 
            *
          FROM Ordenes
          WHERE id_perfil = ?
          AND date(fecha) = date(?)
        `;
        params.push(date1);
    }else{
        query = `
          SELECT 
            *
          FROM Ordenes
          WHERE id_perfil = ?
          AND date(fecha) BETWEEN ? AND ?
        `;
        params.push(date1);
        params.push(date2!);
    }

    // query += ` GROUP BY day ORDER BY day DESC`;

    return await db.getAllAsync<Orden[]>(query, params);
};
