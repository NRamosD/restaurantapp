import { uuid } from "@/assets/utils/uuid";
import { ProductoComponente } from "@/interfaces/product_component";
import * as SQLite from 'expo-sqlite';

// Types
type CreateProductComponentInput = Omit<ProductoComponente, 'id_producto_componente' | 'uuid'> & {
    uuid?: string;
};

type UpdateProductComponentInput = Partial<Omit<ProductoComponente, 'id_producto_componente' | 'uuid'>> & {
    id_producto: number;
    id_componente: number;
};

// Crear relación producto-componente
export const createProductComponent = async (
    db: SQLite.SQLiteDatabase,
    productComponent: CreateProductComponentInput
): Promise<number> => {
    const result = await db.runAsync(
        `INSERT INTO Producto_Componentes (
            id_producto, id_componente, uuid, cantidad
        ) VALUES (?, ?, ?, ?)`,
        [
            productComponent.id_producto,
            productComponent.id_componente,
            productComponent.uuid || uuid(),
            productComponent.cantidad ?? 1
        ]
    );
    
    return result.lastInsertRowId as number;
};

// Obtener relación por ID
export const getProductComponentById = async (
    db: SQLite.SQLiteDatabase,
    id_producto_componente: number
): Promise<ProductoComponente | null> => {
    const result = await db.getFirstAsync<ProductoComponente>(
        `SELECT * FROM Producto_Componentes WHERE id_producto_componente = ?`,
        [id_producto_componente]
    );
    return result ?? null;
};

// Obtener componentes de un producto
export const getComponentsByProductId = async (
    db: SQLite.SQLiteDatabase,
    id_producto: number
): Promise<ProductoComponente[]> => {
    const results = await db.getAllAsync<ProductoComponente>(
        `SELECT pc.*, c.nombre as nombre_componente 
         FROM Producto_Componentes pc
         JOIN Componentes c ON pc.id_componente = c.id_componente
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
         FROM Producto_Componentes pc
         JOIN Producto p ON pc.id_producto = p.id_producto
         WHERE pc.id_componente = ?`,
        [id_componente]
    );
    return results;
};

// Actualizar relación producto-componente
export const updateProductComponent = async (
    db: SQLite.SQLiteDatabase,
    updateData: UpdateProductComponentInput
): Promise<boolean> => {
    const { id_producto, id_componente, ...updates } = updateData;
    
    if (!id_producto || !id_componente) {
        throw new Error("❌ La relación producto-componente debe tener id_producto e id_componente para actualizar");
    }

    const updateFields: string[] = [];
    const params: (string | number)[] = [];

    // Solo actualizar los campos que se proporcionan
    if ('cantidad' in updates) {
        updateFields.push('cantidad = ?');
        params.push(updates.cantidad ?? 1);
    }

    if (updateFields.length === 0) {
        return false; // No hay nada que actualizar
    }

    // Agregar las condiciones WHERE
    params.push(id_producto, id_componente);

    const result = await db.runAsync(
        `UPDATE Producto_Componentes 
         SET ${updateFields.join(', ')}
         WHERE id_producto = ? AND id_componente = ?`,
        params
    );

    return result.changes > 0;
};

// Eliminar relación producto-componente
export const deleteProductComponent = async (
    db: SQLite.SQLiteDatabase,
    id_producto: number,
    id_componente: number
): Promise<boolean> => {
    const result = await db.runAsync(
        "DELETE FROM Producto_Componentes WHERE id_producto = ? AND id_componente = ?",
        [id_producto, id_componente]
    );
    return result.changes > 0;
};

// Eliminar relación por ID
export const deleteProductComponentById = async (
    db: SQLite.SQLiteDatabase,
    id_producto_componente: number
): Promise<boolean> => {
    const result = await db.runAsync(
        "DELETE FROM Producto_Componentes WHERE id_producto_componente = ?",
        [id_producto_componente]
    );
    return result.changes > 0;
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
         FROM Producto_Componentes pc
         JOIN Producto p ON pc.id_producto = p.id_producto
         JOIN Componentes c ON pc.id_componente = c.id_componente
         WHERE pc.id_producto = ? AND pc.id_componente = ?`,
        [id_producto, id_componente]
    );
    return result ?? null;
};

// Verificar si existe una relación producto-componente
export const productComponentExists = async (
    db: SQLite.SQLiteDatabase,
    id_producto: number,
    id_componente: number
): Promise<boolean> => {
    const result = await db.getFirstAsync<{ count: number }>(
        "SELECT COUNT(*) as count FROM Producto_Componentes WHERE id_producto = ? AND id_componente = ?",
        [id_producto, id_componente]
    );
    return (result?.count ?? 0) > 0;
};

// Verificar si un componente se puede eliminar (no está siendo usado por ningún producto)
export const canDeleteComponent = async (
    db: SQLite.SQLiteDatabase,
    id_componente: number
): Promise<boolean> => {
    const result = await db.getFirstAsync<{ count: number }>(
        "SELECT COUNT(*) as count FROM Producto_Componentes WHERE id_componente = ?",
        [id_componente]
    );
    return (result?.count ?? 0) === 0;
};

// Verificar si un producto tiene componentes
export const hasProductComponents = async (
    db: SQLite.SQLiteDatabase,
    id_producto: number
): Promise<boolean> => {
    const result = await db.getFirstAsync<{ count: number }>(
        "SELECT COUNT(*) as count FROM Producto_Componentes WHERE id_producto = ?",
        [id_producto]
    );
    return (result?.count ?? 0) > 0;
};

// Obtener el inventario total de un componente sumando las cantidades de todos los productos que lo usan
export const getTotalComponentUsage = async (
    db: SQLite.SQLiteDatabase,
    id_componente: number
): Promise<number> => {
    const result = await db.getFirstAsync<{ total: number }>(
        `SELECT COALESCE(SUM(pc.cantidad * p.stock), 0) as total
         FROM Producto_Componentes pc
         JOIN Producto p ON pc.id_producto = p.id_producto
         WHERE pc.id_componente = ?`,
        [id_componente]
    );
    return result?.total ?? 0;
};

// Obtener el costo total de componentes para un producto
export const getProductComponentCost = async (
    db: SQLite.SQLiteDatabase,
    id_producto: number
): Promise<number> => {
    const result = await db.getFirstAsync<{ total: number }>(
        `SELECT COALESCE(SUM(pc.cantidad * c.precio), 0) as total
         FROM Producto_Componentes pc
         JOIN Componentes c ON pc.id_componente = c.id_componente
         WHERE pc.id_producto = ?`,
        [id_producto]
    );
    return result?.total ?? 0;
};

// Obtener todos los productos con sus componentes
export const getAllProductsWithComponents = async (
    db: SQLite.SQLiteDatabase,
    id_perfil?: number
): Promise<Array<{
    id_producto: number;
    nombre_producto: string;
    componentes: Array<{
        id_componente: number;
        nombre_componente: string;
        cantidad: number;
    }>;
}>> => {
    let query = `
        SELECT 
            p.id_producto,
            p.nombre as nombre_producto,
            c.id_componente,
            c.nombre as nombre_componente,
            pc.cantidad
        FROM Producto p
        LEFT JOIN Producto_Componentes pc ON p.id_producto = pc.id_producto
        LEFT JOIN Componentes c ON pc.id_componente = c.id_componente
    `;
    
    const params: number[] = [];
    if (id_perfil !== undefined) {
        query += " WHERE p.id_perfil = ?";
        params.push(id_perfil);
    }
    
    query += " ORDER BY p.nombre, c.nombre";
    
    const results = await db.getAllAsync<{
        id_producto: number;
        nombre_producto: string;
        id_componente: number | null;
        nombre_componente: string | null;
        cantidad: number | null;
    }>(query, params);
    
    // Agrupar resultados por producto
    const productsMap = new Map<number, {
        id_producto: number;
        nombre_producto: string;
        componentes: Array<{
            id_componente: number;
            nombre_componente: string;
            cantidad: number;
        }>;
    }>();
    
    for (const row of results) {
        if (!productsMap.has(row.id_producto)) {
            productsMap.set(row.id_producto, {
                id_producto: row.id_producto,
                nombre_producto: row.nombre_producto,
                componentes: []
            });
        }
        
        if (row.id_componente && row.nombre_componente && row.cantidad) {
            productsMap.get(row.id_producto)?.componentes.push({
                id_componente: row.id_componente,
                nombre_componente: row.nombre_componente,
                cantidad: row.cantidad
            });
        }
    }
    
    return Array.from(productsMap.values());
};

// Actualizar múltiples relaciones producto-componente de una sola vez
export const updateProductComponents = async (
    db: SQLite.SQLiteDatabase,
    id_producto: number,
    components: Array<{
        id_componente: number;
        cantidad: number;
    }>
): Promise<void> => {
    await db.execAsync('BEGIN TRANSACTION');
    
    try {
        // Eliminar relaciones existentes para este producto
        await db.runAsync(
            'DELETE FROM Producto_Componentes WHERE id_producto = ?',
            [id_producto]
        );
        
        // Insertar las nuevas relaciones
        for (const { id_componente, cantidad } of components) {
            await db.runAsync(
                `INSERT INTO Producto_Componentes 
                 (id_producto, id_componente, uuid, cantidad)
                 VALUES (?, ?, ?, ?)`,
                [id_producto, id_componente, uuid(), cantidad]
            );
        }
        
        await db.execAsync('COMMIT');
    } catch (error) {
        await db.execAsync('ROLLBACK');
        throw error;
    }
};