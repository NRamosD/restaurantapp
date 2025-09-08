import { uuid } from "@/assets/utils/uuid";
import { ProductoComponente } from "@/interfaces/product_component";
import * as SQLite from 'expo-sqlite';

// Crear relación producto-componente
export const createProductComponent = async (
    dbConnection: SQLite.SQLiteDatabase,
    productComponent: ProductoComponente
) => {
    await dbConnection.runAsync(
        `INSERT INTO Producto_Componente (
            id_producto, id_componente, uuid, cantidad
        ) VALUES (?, ?, ?, ?)`,
        [
            productComponent.id_producto,
            productComponent.id_componente,
            uuid(),
            productComponent.cantidad ?? 1
        ]
    );
};

// Obtener componentes de un producto
export const getComponentsByProductId = async (
    db: SQLite.SQLiteDatabase,
    id_producto: number
): Promise<ProductoComponente[]> => {
    const results = await db.getAllAsync<ProductoComponente>(
        `SELECT pc.*, c.nombre as nombre_componente 
         FROM Producto_Componente pc
         JOIN Componente c ON pc.id_componente = c.id_componente
         WHERE pc.id_producto = ?`,
        [id_producto]
    );
    return results;
};

// Obtener productos que usan un componente
export const getProductsByComponentId = async (
    db: SQLite.SQLiteDatabase,
    id_componente: number
): Promise<ProductoComponente[]> => {
    const results = await db.getAllAsync<ProductoComponente>(
        `SELECT pc.*, p.nombre as nombre_producto 
         FROM Producto_Componente pc
         JOIN Producto p ON pc.id_producto = p.id_producto
         WHERE pc.id_componente = ?`,
        [id_componente]
    );
    return results;
};

// Actualizar relación producto-componente
export const updateProductComponent = async (
    db: SQLite.SQLiteDatabase,
    productComponent: ProductoComponente
) => {
    if (!productComponent.id_producto || !productComponent.id_componente) {
        throw new Error("❌ La relación producto-componente debe tener id_producto e id_componente para actualizar");
    }

    await db.runAsync(
        `UPDATE Producto_Componente SET
            cantidad = ?
        WHERE id_producto = ? AND id_componente = ?`,
        [
            productComponent.cantidad ?? 1,
            productComponent.id_producto,
            productComponent.id_componente
        ]
    );
};

// Eliminar relación producto-componente
export const deleteProductComponent = async (
    db: SQLite.SQLiteDatabase,
    id_producto: number,
    id_componente: number
) => {
    await db.runAsync(
        "DELETE FROM Producto_Componente WHERE id_producto = ? AND id_componente = ?",
        [id_producto, id_componente]
    );
};

// Obtener una relación específica producto-componente
export const getProductComponent = async (
    db: SQLite.SQLiteDatabase,
    id_producto: number,
    id_componente: number
): Promise<ProductoComponente | null> => {
    const result = await db.getFirstAsync<ProductoComponente>(
        `SELECT pc.*, 
                p.nombre as nombre_producto,
                c.nombre as nombre_componente
         FROM Producto_Componente pc
         JOIN Producto p ON pc.id_producto = p.id_producto
         JOIN Componente c ON pc.id_componente = c.id_componente
         WHERE pc.id_producto = ? AND pc.id_componente = ?`,
        [id_producto, id_componente]
    );
    return result ?? null;
};

// Verificar si un componente se puede eliminar (no está siendo usado por ningún producto)
export const canDeleteComponent = async (
    db: SQLite.SQLiteDatabase,
    id_componente: number
): Promise<boolean> => {
    const result = await db.getFirstAsync<{ count: number }>(
        "SELECT COUNT(*) as count FROM Producto_Componente WHERE id_componente = ?",
        [id_componente]
    );
    return (result?.count ?? 0) === 0;
};

// Obtener el inventario total de un componente sumando las cantidades de todos los productos que lo usan
export const getTotalComponentUsage = async (
    db: SQLite.SQLiteDatabase,
    id_componente: number
): Promise<number> => {
    const result = await db.getFirstAsync<{ total: number }>(
        `SELECT COALESCE(SUM(pc.cantidad * p.stock), 0) as total
         FROM Producto_Componente pc
         JOIN Producto p ON pc.id_producto = p.id_producto
         WHERE pc.id_componente = ?`,
        [id_componente]
    );
    return result?.total ?? 0;
};