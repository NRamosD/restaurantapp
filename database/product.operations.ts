import { uuid } from "@/assets/utils/uuid";
import { Product } from "@/interfaces"
import * as SQLite from 'expo-sqlite';

//crear producto
export const createProduct = async (dbConnection:SQLite.SQLiteDatabase, product:Product) => {
    await dbConnection.runAsync(
        `INSERT INTO Producto (
          uuid, id_perfil, nombre, descripcion, imagen, iva, precio, precio_total,
          stock, estado, imagen_url, galeria, video_url, codigo_barras, slug,
          descuento, precio_anterior, envio_gratis, tiempo_entrega
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          uuid(),
          product.id_perfil,
          product.nombre,
          product.descripcion ?? null,
          product.imagen ?? null,
          product.iva ?? null,
          product.precio ?? null,
          product.precio_total ?? null,
          product.stock ?? 0,
          product.estado ?? "disponible",
          product.imagen_url ?? "",
          product.galeria!,
          product.video_url ?? "",
          product.codigo_barras ?? "",
          product.slug ?? "",
          product.descuento ?? "",
          product.precio_anterior ?? "",
          product.envio_gratis ?? 0,
          product.tiempo_entrega ?? "",
        ]
    );
}



// ✅ Obtener producto por ID
export const getProductById = async (
    db: SQLite.SQLiteDatabase,
    id_producto: number
  ): Promise<Product | null> => {
    const result = await db.getFirstAsync<Product>(
      "SELECT * FROM Producto WHERE id_producto = ?",
      [id_producto]
    );
    return result ?? null;
  };
  
  // ✅ Listar todos los productos
  export const getAllProducts = async (
    db: SQLite.SQLiteDatabase
  ): Promise<Product[]> => {
    const results = await db.getAllAsync<Product>("SELECT * FROM Producto");
    return results;
  };
  
  // ✅ Actualizar producto
  export const updateProduct = async (
    db: SQLite.SQLiteDatabase,
    product: Product
  ) => {
    if (!product.id_producto) {
      throw new Error("❌ El producto debe tener id_producto para actualizar");
    }
  
    await db.runAsync(
      `UPDATE Producto SET
        nombre = ?, descripcion = ?, imagen = ?, iva = ?, precio = ?, precio_total = ?,
        stock = ?, estado = ?, imagen_url = ?, galeria = ?, video_url = ?, 
        codigo_barras = ?, slug = ?, descuento = ?, precio_anterior = ?, 
        envio_gratis = ?, tiempo_entrega = ?
      WHERE id_producto = ?`,
        [
            product.nombre,
            product.descripcion ?? null,
            product.imagen ?? null,
            product.iva ?? null,
            product.precio,
            product.precio_total,
            product.stock ?? 0,
            product.estado ?? "disponible",
            product.imagen_url ?? null,
            product.galeria ?? null,
            product.video_url ?? null,
            product.codigo_barras ?? null,
            product.slug ?? null,
            product.descuento ?? null,
            product.precio_anterior ?? null,
            product.envio_gratis ?? 0,
            product.tiempo_entrega ?? null,
            product.id_producto,
        ]
    );
};
  
// ✅ Eliminar producto
export const deleteProduct = async (
    db: SQLite.SQLiteDatabase,
    id_producto: number
) => {
    await db.runAsync("DELETE FROM Producto WHERE id_producto = ?", [id_producto]);
};