import { uuid } from "@/assets/utils/uuid";
import { Product } from "@/interfaces";
import * as SQLite from 'expo-sqlite';
import { ToastAndroid } from "react-native";

// Types
export type CreateProductInput = Omit<Product, 'id_producto' | 'uuid' | 'fecha_creacion'> & { 
    uuid?: string;
    galeria?: string | null;
};

type UpdateProductInput = Partial<Omit<Product, 'id_producto' | 'uuid' | 'fecha_creacion'>> & {
    id_producto: number;
};

type ProductFilter = {
    searchTerm?: string;
    minPrice?: number;
    maxPrice?: number;
    estado?: string;
    id_perfil?: number;
    inStockOnly?: boolean;
};

// Crear un nuevo producto
export const createProduct = async (
    db: SQLite.SQLiteDatabase,
    product: CreateProductInput
): Promise<number> => {
    const precio_total = product.precio_total ?? 
        (product.precio && product.iva ? 
            product.precio * (1 + (product.iva / 100)) : 
            product.precio);

    const result = await db.runAsync(
        `INSERT INTO Producto (
            uuid, id_perfil, id_negocio, nombre, descripcion, imagen, iva, precio, precio_total,
            stock, estado, imagen_url, galeria, video_url, codigo_barras, slug,
            descuento, precio_anterior, envio_gratis, tiempo_entrega, ilimitado
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            product.uuid || uuid(),
            product.id_perfil,
            product.id_negocio||null,
            product.nombre,
            product.descripcion ?? null,
            product.imagen ?? null,
            product.iva ?? null,
            product.precio,
            precio_total,
            product.stock ?? 0,
            product.estado ?? 'disponible',
            product.imagen_url ?? null,
            product.galeria ?? null,
            product.video_url ?? null,
            product.codigo_barras ?? null,
            product.slug ?? null,
            product.descuento ?? null,
            product.precio_anterior ?? null,
            product.envio_gratis ?? 0,
            product.tiempo_entrega ?? null,
            product.ilimitado ?? 1
        ]
    );
    ToastAndroid.show(`${product.nombre} creado exitosamente`, ToastAndroid.LONG);
    
    return result.lastInsertRowId as number;
};

// Obtener producto por ID
export const getProductById = async (
    db: SQLite.SQLiteDatabase,
    id_producto: number
): Promise<Product | null> => {
    const result = await db.getFirstAsync<Product>(
        `SELECT * FROM Producto WHERE id_producto = ?`,
        [id_producto]
    );
    return result ?? null;
};

// Obtener producto por UUID
export const getProductByUuid = async (
    db: SQLite.SQLiteDatabase,
    uuid: string
): Promise<Product | null> => {
    const result = await db.getFirstAsync<Product>(
        `SELECT * FROM Producto WHERE uuid = ?`,
        [uuid]
    );
    return result ?? null;
};

// Obtener producto por código de barras
export const getProductByBarcode = async (
    db: SQLite.SQLiteDatabase,
    codigo_barras: string
): Promise<Product | null> => {
    const result = await db.getFirstAsync<Product>(
        `SELECT * FROM Producto WHERE codigo_barras = ?`,
        [codigo_barras]
    );
    return result ?? null;
};

// Listar productos con filtros y paginación
export const getProducts = async (
    db: SQLite.SQLiteDatabase,
    filter: ProductFilter = {},
    limit: number = 100,
    offset: number = 0
): Promise<Product[]> => {
    let query = "SELECT * FROM Producto WHERE 1=1";
    const params: (string | number)[] = [];

    if (filter.searchTerm) {
        query += " AND (nombre LIKE ? OR descripcion LIKE ? OR codigo_barras = ?)";
        const searchTerm = `%${filter.searchTerm}%`;
        params.push(searchTerm, searchTerm, filter.searchTerm);
    }

    if (filter.minPrice !== undefined) {
        query += " AND precio >= ?";
        params.push(filter.minPrice);
    }

    if (filter.maxPrice !== undefined) {
        query += " AND precio <= ?";
        params.push(filter.maxPrice);
    }

    if (filter.estado) {
        query += " AND estado = ?";
        params.push(filter.estado);
    }

    if (filter.id_perfil) {
        query += " AND id_perfil = ?";
        params.push(filter.id_perfil);
    }

    if (filter.inStockOnly) {
        query += " AND stock > 0";
    }

    query += " ORDER BY nombre ASC LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const results = await db.getAllAsync<Product>(query, params);
    return results;
};

// Listar todos los productos (sin filtros)
export const getAllProducts = async (
    db: SQLite.SQLiteDatabase,
    limit: number = 100,
    offset: number = 0
): Promise<Product[]> => {
    return getProducts(db, {}, limit, offset);
};

// Actualizar producto
export const updateProduct = async (
    db: SQLite.SQLiteDatabase,
    product: UpdateProductInput
): Promise<void> => {
    if (!product.id_producto) {
        throw new Error("❌ El producto debe tener id_producto para actualizar");
    }

    const existingProduct = await getProductById(db, product.id_producto);
    if (!existingProduct) {
        throw new Error("❌ No se encontró el producto especificado");
    }

    // Recalcular precio_total si se actualiza precio o iva
    let precio_total = product.precio_total;
    if (product.precio !== undefined || product.iva !== undefined) {
        const precio = product.precio ?? existingProduct.precio;
        const iva = product.iva ?? existingProduct.iva;
        precio_total = iva ? precio * (1 + (iva / 100)) : precio;
    }

    const updates: string[] = [];
    const params: (string | number | null)[] = [];

    const fields: Array<keyof typeof product> = [
        'nombre', 'descripcion', 'imagen', 'iva', 'precio', 'precio_total',
        'stock', 'estado', 'imagen_url', 'galeria', 'video_url', 'codigo_barras',
        'slug', 'descuento', 'precio_anterior', 'envio_gratis', 'tiempo_entrega', 'ilimitado'
    ];

    fields.forEach(field => {
        if (field in product && product[field] !== undefined) {
            updates.push(`${field} = ?`);
            // Ensure we only push string, number, or null values
            const value = product[field];
            if (typeof value === 'string' || typeof value === 'number' || value === null) {
                params.push(value);
            } else if (typeof value === 'boolean') {
                // Convert boolean to number (0 or 1) for SQLite
                params.push(value ? 1 : 0);
            } else if (value !== undefined) {
                // For any other type, convert to string
                params.push(String(value));
            }
        }
    });

    if (updates.length === 0) {
        return; // No hay nada que actualizar
    }

    // Asegurarse de que precio_total esté actualizado
    if (precio_total !== undefined) {
        updates.push("precio_total = ?");
        params.push(precio_total);
    }

    params.push(product.id_producto);

    await db.runAsync(
        `UPDATE Producto 
         SET ${updates.join(', ')}
         WHERE id_producto = ?`,
        params
    );
};

// Actualizar stock de un producto
export const updateProductStock = async (
    db: SQLite.SQLiteDatabase,
    id_producto: number,
    quantity: number, // Puede ser negativo para reducir el stock
    operation: 'add' | 'set' = 'add'
): Promise<void> => {
    if (operation === 'add') {
        await db.runAsync(
            `UPDATE Producto 
             SET stock = stock + ? 
             WHERE id_producto = ?`,
            [quantity, id_producto]
        );
    } else {
        await db.runAsync(
            `UPDATE Producto 
             SET stock = ? 
             WHERE id_producto = ?`,
            [quantity, id_producto]
        );
    }
};

// Eliminar producto
export const deleteProduct = async (
    db: SQLite.SQLiteDatabase,
    id_producto: number
): Promise<boolean> => {
    const result = await db.runAsync(
        "DELETE FROM Producto WHERE id_producto = ?",
        [id_producto]
    );
    return result.changes > 0;
};

// Obtener productos por estado
export const getProductsByStatus = async (
    db: SQLite.SQLiteDatabase,
    estado: string,
    limit: number = 100,
    offset: number = 0
): Promise<Product[]> => {
    return getProducts(db, { estado }, limit, offset);
};

// Buscar productos por nombre o descripción
export const searchProducts = async (
    db: SQLite.SQLiteDatabase,
    searchTerm: string,
    limit: number = 50
): Promise<Product[]> => {
    return getProducts(db, { searchTerm }, limit, 0);
};

// Obtener productos con bajo stock
export const getLowStockProducts = async (
    db: SQLite.SQLiteDatabase,
    threshold: number = 5,
    limit: number = 100,
    offset: number = 0
): Promise<Product[]> => {
    const results = await db.getAllAsync<Product>(
        `SELECT * FROM Producto 
         WHERE stock <= ? 
         ORDER BY stock ASC, nombre ASC
         LIMIT ? OFFSET ?`,
        [threshold, limit, offset]
    );
    return results;
};

// Obtener estadísticas de productos
export const getProductStatistics = async (
    db: SQLite.SQLiteDatabase,
    id_perfil?: number
) => {
    let whereClause = '';
    const params: number[] = [];
    
    if (id_perfil) {
        whereClause = 'WHERE id_perfil = ?';
        params.push(id_perfil);
    }

    const [
        totalProducts,
        availableProducts,
        outOfStockProducts,
        stockValue
    ] = await Promise.all([
        db.getFirstAsync<{ count: number }>(
            `SELECT COUNT(*) as count FROM Producto ${whereClause}`,
            params
        ),
        db.getFirstAsync<{ count: number }>(
            `SELECT COUNT(*) as count FROM Producto 
             WHERE stock > 0 ${id_perfil ? 'AND id_perfil = ?' : ''}`,
            id_perfil ? [id_perfil] : []
        ),
        db.getFirstAsync<{ count: number }>(
            `SELECT COUNT(*) as count FROM Producto 
             WHERE stock = 0 ${id_perfil ? 'AND id_perfil = ?' : ''}`,
            id_perfil ? [id_perfil] : []
        ),
        db.getFirstAsync<{ total: number }>(
            `SELECT COALESCE(SUM(precio * stock), 0) as total 
             FROM Producto 
             ${whereClause}`,
            params
        )
    ]);

    return {
        total_products: totalProducts?.count ?? 0,
        available_products: availableProducts?.count ?? 0,
        out_of_stock_products: outOfStockProducts?.count ?? 0,
        total_stock_value: stockValue?.total ?? 0
    };
};