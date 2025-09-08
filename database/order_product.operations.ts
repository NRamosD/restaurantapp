import { uuid } from "@/assets/utils/uuid";
import { OrdenProducto } from "@/interfaces/order_product";
import * as SQLite from 'expo-sqlite';

// Crear relación orden-producto
export const createOrderProduct = async (
    dbConnection: SQLite.SQLiteDatabase,
    orderProduct: OrdenProducto
) => {
    await dbConnection.runAsync(
        `INSERT INTO Orden_Producto (
            id_orden, id_producto, uuid, cantidad, precio_unitario, subtotal, detalle
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            orderProduct.id_orden,
            orderProduct.id_producto,
            uuid(),
            orderProduct.cantidad,
            orderProduct.precio_unitario,
            orderProduct.subtotal ?? (orderProduct.cantidad * orderProduct.precio_unitario),
            orderProduct.detalle ?? null
        ]
    );
};

// Obtener productos de una orden
export const getProductsByOrderId = async (
    db: SQLite.SQLiteDatabase,
    id_orden: number
): Promise<OrdenProducto[]> => {
    const results = await db.getAllAsync<OrdenProducto>(
        "SELECT * FROM Orden_Producto WHERE id_orden = ?",
        [id_orden]
    );
    return results;
};

// Obtener ordenes por producto
export const getOrdersByProductId = async (
    db: SQLite.SQLiteDatabase,
    id_producto: number
): Promise<OrdenProducto[]> => {
    const results = await db.getAllAsync<OrdenProducto>(
        "SELECT * FROM Orden_Producto WHERE id_producto = ?",
        [id_producto]
    );
    return results;
};

// Actualizar relación orden-producto
export const updateOrderProduct = async (
    db: SQLite.SQLiteDatabase,
    orderProduct: OrdenProducto
) => {
    if (!orderProduct.id_orden || !orderProduct.id_producto) {
        throw new Error("❌ La relación orden-producto debe tener id_orden e id_producto para actualizar");
    }

    await db.runAsync(
        `UPDATE Orden_Producto SET
            cantidad = ?,
            precio_unitario = ?,
            subtotal = ?,
            detalle = ?
        WHERE id_orden = ? AND id_producto = ?`,
        [
            orderProduct.cantidad,
            orderProduct.precio_unitario,
            orderProduct.subtotal ?? (orderProduct.cantidad * orderProduct.precio_unitario),
            orderProduct.detalle ?? null,
            orderProduct.id_orden,
            orderProduct.id_producto
        ]
    );
};

// Eliminar relación orden-producto
export const deleteOrderProduct = async (
    db: SQLite.SQLiteDatabase,
    id_orden: number,
    id_producto: number
) => {
    await db.runAsync(
        "DELETE FROM Orden_Producto WHERE id_orden = ? AND id_producto = ?",
        [id_orden, id_producto]
    );
};

// Obtener un producto específico de una orden
export const getOrderProduct = async (
    db: SQLite.SQLiteDatabase,
    id_orden: number,
    id_producto: number
): Promise<OrdenProducto | null> => {
    const result = await db.getFirstAsync<OrdenProducto>(
        "SELECT * FROM Orden_Producto WHERE id_orden = ? AND id_producto = ?",
        [id_orden, id_producto]
    );
    return result ?? null;
};

// Calcular el total de una orden
export const calculateOrderTotal = async (
    db: SQLite.SQLiteDatabase,
    id_orden: number
): Promise<number> => {
    const result = await db.getFirstAsync<{ total: number }>(
        "SELECT SUM(subtotal) as total FROM Orden_Producto WHERE id_orden = ?",
        [id_orden]
    );
    return result?.total ?? 0;
};