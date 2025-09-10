import { uuid } from "@/assets/utils/uuid";
import { OrdenProducto } from "@/interfaces/order_product";
import * as SQLite from 'expo-sqlite';

// Types
type CreateOrderProductInput = Omit<OrdenProducto, 'id_orden_producto' | 'uuid'> & { uuid?: string };
type UpdateOrderProductInput = Partial<OrdenProducto> & { id_orden: number; id_producto: number };

// Crear relación orden-producto
export const createOrderProduct = async (
    db: SQLite.SQLiteDatabase,
    orderProduct: CreateOrderProductInput
): Promise<number> => {
    const subtotal = orderProduct.subtotal ?? (orderProduct.cantidad * orderProduct.precio_unitario);
    
    const result = await db.runAsync(
        `INSERT INTO Ordenes_Producto (
            id_orden, id_producto, uuid, cantidad, precio_unitario, subtotal, detalle
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
            orderProduct.id_orden,
            orderProduct.id_producto,
            orderProduct.uuid || uuid(),
            orderProduct.cantidad,
            orderProduct.precio_unitario,
            subtotal,
            orderProduct.detalle ?? null
        ]
    );
    
    return result.lastInsertRowId as number;
};

// Obtener un producto de orden por ID
export const getOrderProductById = async (
    db: SQLite.SQLiteDatabase,
    id_orden_producto: number
): Promise<OrdenProducto | null> => {
    const result = await db.getFirstAsync<OrdenProducto>(
        `SELECT * FROM Ordenes_Producto WHERE id_orden_producto = ?`,
        [id_orden_producto]
    );
    return result ?? null;
};

// Obtener un producto específico de una orden
export const getOrderProduct = async (
    db: SQLite.SQLiteDatabase,
    id_orden: number,
    id_producto: number
): Promise<OrdenProducto | null> => {
    const result = await db.getFirstAsync<OrdenProducto>(
        `SELECT * FROM Ordenes_Producto WHERE id_orden = ? AND id_producto = ?`,
        [id_orden, id_producto]
    );
    return result ?? null;
};

// Obtener todos los productos de una orden
export const getProductsByOrderId = async (
    db: SQLite.SQLiteDatabase,
    id_orden: number
): Promise<OrdenProducto[]> => {
    const results = await db.getAllAsync<OrdenProducto>(
        `SELECT * FROM Ordenes_Producto WHERE id_orden = ?`,
        [id_orden]
    );
    return results;
};

// Obtener todas las órdenes que contienen un producto específico
export const getOrdersByProductId = async (
    db: SQLite.SQLiteDatabase,
    id_producto: number,
    limit: number = 100,
    offset: number = 0
): Promise<OrdenProducto[]> => {
    const results = await db.getAllAsync<OrdenProducto>(
        `SELECT * FROM Ordenes_Producto 
         WHERE id_producto = ? 
         ORDER BY id_orden DESC
         LIMIT ? OFFSET ?`,
        [id_producto, limit, offset]
    );
    return results;
};

// Actualizar relación orden-producto
export const updateOrderProduct = async (
    db: SQLite.SQLiteDatabase,
    orderProduct: UpdateOrderProductInput
): Promise<void> => {
    if (!orderProduct.id_orden || !orderProduct.id_producto) {
        throw new Error("❌ La relación orden-producto debe tener id_orden e id_producto para actualizar");
    }

    const existing = await getOrderProduct(db, orderProduct.id_orden, orderProduct.id_producto);
    if (!existing) {
        throw new Error("❌ No se encontró la relación orden-producto especificada");
    }

    const updates: string[] = [];
    const params: Array<string | number | null> = [];

    if (orderProduct.cantidad !== undefined) {
        updates.push("cantidad = ?");
        params.push(orderProduct.cantidad);
    }

    if (orderProduct.precio_unitario !== undefined) {
        updates.push("precio_unitario = ?");
        params.push(orderProduct.precio_unitario);
    }

    // Recalcular subtotal si cantidad o precio_unitario cambian
    if (orderProduct.cantidad !== undefined || orderProduct.precio_unitario !== undefined) {
        const cantidad = orderProduct.cantidad ?? existing.cantidad;
        const precio_unitario = orderProduct.precio_unitario ?? existing.precio_unitario;
        updates.push("subtotal = ?");
        params.push(cantidad * precio_unitario);
    } else if (orderProduct.subtotal !== undefined) {
        updates.push("subtotal = ?");
        params.push(orderProduct.subtotal);
    }

    if ('detalle' in orderProduct) {
        updates.push("detalle = ?");
        params.push(orderProduct.detalle ?? null);
    }

    if (updates.length === 0) {
        return; // No hay nada que actualizar
    }

    params.push(orderProduct.id_orden, orderProduct.id_producto);

    await db.runAsync(
        `UPDATE Ordenes_Producto 
         SET ${updates.join(', ')}
         WHERE id_orden = ? AND id_producto = ?`,
        params
    );
};

// Eliminar relación orden-producto por ID
export const deleteOrderProductById = async (
    db: SQLite.SQLiteDatabase,
    id_orden_producto: number
): Promise<boolean> => {
    const result = await db.runAsync(
        "DELETE FROM Ordenes_Producto WHERE id_orden_producto = ?",
        [id_orden_producto]
    );
    return result.changes > 0;
};

// Eliminar relación orden-producto
export const deleteOrderProduct = async (
    db: SQLite.SQLiteDatabase,
    id_orden: number,
    id_producto: number
): Promise<boolean> => {
    const result = await db.runAsync(
        "DELETE FROM Ordenes_Producto WHERE id_orden = ? AND id_producto = ?",
        [id_orden, id_producto]
    );
    return result.changes > 0;
};

// Eliminar todos los productos de una orden
export const deleteAllProductsFromOrder = async (
    db: SQLite.SQLiteDatabase,
    id_orden: number
): Promise<void> => {
    await db.runAsync(
        "DELETE FROM Ordenes_Producto WHERE id_orden = ?",
        [id_orden]
    );
};

// Calcular el total de una orden
export const calculateOrderTotal = async (
    db: SQLite.SQLiteDatabase,
    id_orden: number
): Promise<number> => {
    const result = await db.getFirstAsync<{ total: number }>(
        "SELECT COALESCE(SUM(subtotal), 0) as total FROM Ordenes_Producto WHERE id_orden = ?",
        [id_orden]
    );
    return result?.total ?? 0;
};

// Obtener estadísticas de productos más vendidos
export const getTopSellingProducts = async (
    db: SQLite.SQLiteDatabase,
    limit: number = 10,
    startDate?: string,
    endDate?: string
) => {
    let query = `
        SELECT 
            p.id_producto,
            p.nombre,
            COUNT(op.id_producto) as veces_vendido,
            SUM(op.cantidad) as cantidad_total,
            SUM(op.subtotal) as ingreso_total
        FROM Ordenes_Producto op
        JOIN Producto p ON op.id_producto = p.id_producto
        JOIN Ordenes o ON op.id_orden = o.id_orden
        WHERE o.estado = 'pagado'
    `;

    const params: (string | number)[] = [];
    
    if (startDate && endDate) {
        query += ' AND o.fecha BETWEEN ? AND ?';
        params.push(startDate, endDate);
    }
    
    query += `
        GROUP BY op.id_producto
        ORDER BY cantidad_total DESC
        LIMIT ?
    `;
    
    params.push(limit);
    
    return await db.getAllAsync<{
        id_producto: number;
        nombre: string;
        veces_vendido: number;
        cantidad_total: number;
        ingreso_total: number;
    }>(query, params);
};