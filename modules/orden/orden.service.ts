import { eq, asc, desc, and, sql, gte, lt } from 'drizzle-orm';
import { useDrizzle } from '@/db/db';
import { Orden, OrdenProducto, Producto, Cliente, Usuario } from '@/db/schema';
import { v4 as uuidv4 } from 'uuid';
import { Orden as OrdenInterface, OrdenProducto as OrdenProductoInterface, Producto as ProductoInterface } from '@/interfaces/general.interface';

type OrdenEstado = 'PENDIENTE' | 'EN_PREPARACION' | 'LISTO' | 'ENTREGADO' | 'CANCELADO';
export type OrdenTipo = 'LOCAL' | 'LLEVAR' | 'DELIVERY';

interface CrearOrdenParams {
  usuarioUuid: string;
  clienteUuid?: string;
  tipo: OrdenTipo;
  observaciones?: string;
}

interface AgregarProductoParams {
  ordenUuid: string;
  productoUuid: string;
  cantidad: number;
  notas?: string;
}

export interface OrdenProductoDetails extends Partial<OrdenProductoInterface>{
  producto: Partial<ProductoInterface>;
}

export interface OrdenDetails{
    orden: Partial<OrdenInterface> | null
    ordenProductos: OrdenProductoDetails[]
}

export function useOrdenService() {
  const db = useDrizzle();

  const crearOrden = async (params: CrearOrdenParams) => {
    const uuid = uuidv4();
    const now = new Date().toISOString();

    const numeroOrdenResult = await db
      .select({ max: sql<number>`MAX(${Orden.numeroOrden})` })
      .from(Orden);
    const numeroOrden = (numeroOrdenResult[0]?.max || 0) + 1;

    const result = await db.insert(Orden).values({
      uuid,
      numeroOrden,
      clienteUuid: params.clienteUuid,
      usuarioUuid: params.usuarioUuid,
      tipo: params.tipo,
      estado: 'PENDIENTE',
      subtotal: 0,
      iva: 0,
      total: 0,
      observaciones: params.observaciones,
      createdAt: now,
      updatedAt: now,
    });

    return result.lastInsertRowId;
  };

  const agregarProductoAOrden = async (params: AgregarProductoParams) => {
    const [producto] = await db
      .select()
      .from(Producto)
      .where(eq(Producto.uuid, params.productoUuid))
      .limit(1);

    if (!producto) throw new Error('Producto no encontrado');
    if (producto.estado !== 'DISPONIBLE') throw new Error('Producto no disponible');

    const precioUnitario = producto.precio;
    const aplicaIva = producto.aplicaIva === 1;
    const porcentajeIva = producto.porcentajeIva;
    const descuento = 0;
    const cantidad = params.cantidad;

    const subtotal = precioUnitario * cantidad;
    const iva = aplicaIva ? Math.round(subtotal * (porcentajeIva / 100)) : 0;
    const total = subtotal + iva;

    const uuid = uuidv4();
    const now = new Date().toISOString();

    await db.insert(OrdenProducto).values({
      uuid,
      ordenUuid: params.ordenUuid,
      productoUuid: params.productoUuid,
      cantidad,
      precioUnitario,
      descuento,
      subtotal,
      iva,
      total,
      notas: params.notas,
      createdAt: now,
      updatedAt: now,
    });

    await recalcularOrden(params.ordenUuid);
  };

  const cambiarEstadoOrden = async (ordenUuid: string, estado: OrdenEstado) => {
    const now = new Date().toISOString();
    await db
      .update(Orden)
      .set({ estado, updatedAt: now })
      .where(eq(Orden.uuid, ordenUuid));
  };

  const recalcularOrden = async (ordenUuid: string) => {
    const productos = await db
      .select()
      .from(OrdenProducto)
      .where(eq(OrdenProducto.ordenUuid, ordenUuid));

    const subtotal = productos.reduce((sum, p) => sum + p.subtotal, 0);
    const iva = productos.reduce((sum, p) => sum + p.iva, 0);
    const total = productos.reduce((sum, p) => sum + p.total, 0);
    const now = new Date().toISOString();

    await db
      .update(Orden)
      .set({ subtotal, iva, total, updatedAt: now })
      .where(eq(Orden.uuid, ordenUuid));
  };

  const cerrarOrden = async (ordenUuid: string) => {
    await cambiarEstadoOrden(ordenUuid, 'ENTREGADO');
  };

  const obtenerOrdenPorUuid = async (ordenUuid: string) : Promise<OrdenDetails | null> => {
    const [orden] = await db
      .select()
      .from(Orden)
      .where(eq(Orden.uuid, ordenUuid))
      .limit(1);

    if (!orden?.uuid) return null;

    const productos = await db
      .select()
      .from(OrdenProducto)
      .where(eq(OrdenProducto.ordenUuid, ordenUuid));

    console.log('productos aqui', productos);

    const productosConDetalle = await Promise.all(
      productos.map(async (op) => {
        const [producto] = await db
          .select()
          .from(Producto)
          .where(eq(Producto.uuid, op.productoUuid))
          .limit(1);
        return { ...op, producto };
      })
    );

    return { orden: orden , ordenProductos: productosConDetalle };
  };

  const obtenerOrdenesPorEstado = async (estado?: OrdenEstado) => {
    if (estado) {
      return db
        .select()
        .from(Orden)
        .where(eq(Orden.estado, estado))
        .orderBy(desc(Orden.createdAt));
    }
    return db.select().from(Orden).orderBy(desc(Orden.createdAt));
  };

  const obtenerOrdenesPorFecha = async (fecha: string) => {
    if (fecha) {
      const inicio = new Date(fecha);
      const fin = new Date(fecha);
      fin.setDate(fin.getDate() + 1);

      return db
        .select()
        .from(Orden)
        .where(
          and(
            gte(Orden.createdAt, inicio.toISOString()),
            lt(Orden.createdAt, fin.toISOString())
          )
        )
        .orderBy(desc(Orden.createdAt));
    }

    return db.select().from(Orden).orderBy(desc(Orden.createdAt));
  };

  const obtenerOrdenConClienteYUsuario = async (ordenUuid: string) => {
    const [orden] = await db
      .select()
      .from(Orden)
      .where(eq(Orden.uuid, ordenUuid))
      .limit(1);

    if (!orden) return null;

    let cliente = null;
    let usuario = null;

    if (orden.clienteUuid) {
      [cliente] = await db
        .select()
        .from(Cliente)
        .where(eq(Cliente.uuid, orden.clienteUuid))
        .limit(1);
    }

    [usuario] = await db
      .select()
      .from(Usuario)
      .where(eq(Usuario.uuid, orden.usuarioUuid))
      .limit(1);

    return { ...orden, cliente, usuario };
  };

  const eliminarProductoDeOrden = async (ordenProductoUuid: string) => {
    const [ordenProducto] = await db
      .select()
      .from(OrdenProducto)
      .where(eq(OrdenProducto.uuid, ordenProductoUuid))
      .limit(1);

    if (!ordenProducto) throw new Error('Producto en orden no encontrado');

    await db
      .delete(OrdenProducto)
      .where(eq(OrdenProducto.uuid, ordenProductoUuid));

    await recalcularOrden(ordenProducto.ordenUuid);
  };

  const cancelarOrden = async (ordenUuid: string) => {
    await cambiarEstadoOrden(ordenUuid, 'CANCELADO');
  };

  return {
    crearOrden,
    agregarProductoAOrden,
    cambiarEstadoOrden,
    recalcularOrden,
    cerrarOrden,
    obtenerOrdenPorUuid,
    obtenerOrdenesPorEstado,
    obtenerOrdenesPorFecha,
    obtenerOrdenConClienteYUsuario,
    eliminarProductoDeOrden,
    cancelarOrden,
  };
}
