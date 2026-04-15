import { eq, like, asc, desc, sql, and, or } from 'drizzle-orm';
import { useDrizzle } from '@/db/db';
import { Producto, Componente, ProductoComponente } from '@/db/schema';
import { v4 as uuidv4 } from 'uuid';
import { Producto as ProductoInterface } from '@/interfaces/general.interface';

type ProductoEstado = 'DISPONIBLE' | 'NO_DISPONIBLE';


// export interface ProductoDisponible {
//   id: number;
//   uuid: string;
//   nombre: string;
//   descripcion: string | null;
//   precio: number;
//   aplicaIva: number;
//   porcentajeIva: number;
//   stock: number;
//   ilimitado: number;
//   imagenUrl: string | null;
//   galeria: string | null;
//   estado: string;
//   perfilNegocioUuid: string;
//   estadoSync: string;
//   createdAt: string;
//   updatedAt: string | null;
//   updatedByUuid: string | null;
//   deletedAt: string | null;
// }

interface CrearProductoParams {
  nombre: string;
  descripcion?: string;
  precio: number;
  aplicaIva?: boolean;
  porcentajeIva?: number;
  stock?: number;
  ilimitado?: boolean;
  imagenUrl?: string;
  perfilNegocioUuid: string;
}

interface ActualizarProductoParams {
  uuid: string;
  nombre?: string;
  descripcion?: string;
  precio?: number;
  aplicaIva?: boolean;
  porcentajeIva?: number;
  stock?: number;
  ilimitado?: boolean;
  estado?: ProductoEstado;
  imagenUrl?: string;
}

export function useProductoService() {
  const db = useDrizzle();

  const obtenerProductos = async (perfilNegocioUuid?: string) => {
    if (perfilNegocioUuid) {
      return db
        .select()
        .from(Producto)
        .where(eq(Producto.perfilNegocioUuid, perfilNegocioUuid))
        .orderBy(asc(Producto.nombre));
    }
    return db.select().from(Producto).orderBy(asc(Producto.nombre));
  };

  
  const obtenerProductosDisponibles = async (perfilNegocioUuid?: string): Promise<ProductoInterface[]> => {
    const condiciones = [eq(Producto.estado, 'DISPONIBLE')];
    if (perfilNegocioUuid) {
      condiciones.push(eq(Producto.perfilNegocioUuid, perfilNegocioUuid));
    }

    return db
      .select()
      .from(Producto)
      .where(and(...condiciones))
      .orderBy(asc(Producto.nombre));
  };

  const obtenerProductoPorUuid = async (productoUuid: string) => {
    const [producto] = await db
      .select()
      .from(Producto)
      .where(eq(Producto.uuid, productoUuid))
      .limit(1);
    return producto || null;
  };

  const buscarProductos = async (termino: string, perfilNegocioUuid?: string) => {
    const condiciones = or(
      like(Producto.nombre, `%${termino}%`),
      like(Producto.descripcion, `%${termino}%`)
    );

    if (perfilNegocioUuid) {
      return db
        .select()
        .from(Producto)
        .where(and(condiciones, eq(Producto.perfilNegocioUuid, perfilNegocioUuid)))
        .orderBy(asc(Producto.nombre));
    }

    return db
      .select()
      .from(Producto)
      .where(condiciones)
      .orderBy(asc(Producto.nombre));
  };

  const crearProducto = async (params: CrearProductoParams) => {
    const uuid = uuidv4();
    const now = new Date().toISOString();

    const result = await db.insert(Producto).values({
      uuid,
      nombre: params.nombre,
      descripcion: params.descripcion,
      precio: params.precio,
      aplicaIva: params.aplicaIva !== false ? 1 : 0,
      porcentajeIva: params.porcentajeIva || 12.0,
      stock: params.stock || 0,
      ilimitado: params.ilimitado ? 1 : 0,
      estado: 'DISPONIBLE',
      imagenUrl: params.imagenUrl,
      perfilNegocioUuid: params.perfilNegocioUuid,
      createdAt: now,
    });

    return result.lastInsertRowId;
  };

  const actualizarProducto = async (params: ActualizarProductoParams) => {
    const now = new Date().toISOString();
    const updates: Record<string, unknown> = { updatedAt: now };

    if (params.nombre) updates.nombre = params.nombre;
    if (params.descripcion !== undefined) updates.descripcion = params.descripcion;
    if (params.precio) updates.precio = params.precio;
    if (params.aplicaIva !== undefined) updates.aplicaIva = params.aplicaIva ? 1 : 0;
    if (params.porcentajeIva) updates.porcentajeIva = params.porcentajeIva;
    if (params.stock !== undefined) updates.stock = params.stock;
    if (params.ilimitado !== undefined) updates.ilimitado = params.ilimitado ? 1 : 0;
    if (params.estado) updates.estado = params.estado;
    if (params.imagenUrl !== undefined) updates.imagenUrl = params.imagenUrl;

    await db.update(Producto).set(updates).where(eq(Producto.uuid, params.uuid));
  };

  const actualizarStock = async (productoUuid: string, nuevoStock: number) => {
    const now = new Date().toISOString();
    await db
      .update(Producto)
      .set({ stock: nuevoStock, updatedAt: now })
      .where(eq(Producto.uuid, productoUuid));
  };

  const descontarStock = async (productoUuid: string, cantidad: number) => {
    const producto = await obtenerProductoPorUuid(productoUuid);
    if (!producto) throw new Error('Producto no encontrado');

    if (!producto.ilimitado && producto.stock < cantidad) {
      throw new Error('Stock insuficiente');
    }

    if (!producto.ilimitado) {
      const nuevoStock = producto.stock - cantidad;
      await actualizarStock(productoUuid, nuevoStock);
    }
  };

  const obtenerComponentesPorProducto = async (productoUuid: string) => {
    const relaciones = await db
      .select()
      .from(ProductoComponente)
      .where(eq(ProductoComponente.productoUuid, productoUuid));

    return Promise.all(
      relaciones.map(async (rel) => {
        const [componente] = await db
          .select()
          .from(Componente)
          .where(eq(Componente.uuid, rel.componenteUuid))
          .limit(1);
        return { ...rel, componente };
      })
    );
  };

  const obtenerTopProductos = async (limite: number = 10, perfilNegocioUuid?: string) => {
    return db
      .select()
      .from(Producto)
      .where(perfilNegocioUuid ? eq(Producto.perfilNegocioUuid, perfilNegocioUuid) : undefined)
      .orderBy(desc(Producto.createdAt))
      .limit(limite);
  };

  const cambiarEstado = async (productoUuid: string, estado: ProductoEstado) => {
    const now = new Date().toISOString();
    await db
      .update(Producto)
      .set({ estado, updatedAt: now })
      .where(eq(Producto.uuid, productoUuid));
  };

  return {
    obtenerProductos,
    obtenerProductosDisponibles,
    obtenerProductoPorUuid,
    buscarProductos,
    crearProducto,
    actualizarProducto,
    actualizarStock,
    descontarStock,
    obtenerComponentesPorProducto,
    obtenerTopProductos,
    cambiarEstado,
  };
}
