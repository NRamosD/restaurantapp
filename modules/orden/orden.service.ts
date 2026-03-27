import { eq, asc, desc, and, sql } from 'drizzle-orm';
import { useDrizzle } from '@/db/db';
import { Orden, OrdenProducto, Producto, Cliente, Usuario } from '@/db/schema';
import { v4 as uuidv4 } from 'uuid';

type OrdenEstado = 'PENDIENTE' | 'EN_PREPARACION' | 'LISTO' | 'ENTREGADO' | 'CANCELADO';
type OrdenTipo = 'LOCAL' | 'LLEVAR' | 'DELIVERY';

interface CrearOrdenParams {
  usuarioId: number;
  clienteId?: number;
  tipo: OrdenTipo;
  observaciones?: string;
}

interface AgregarProductoParams {
  ordenId: number;
  productoId: number;
  cantidad: number;
  notas?: string;
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
      clienteId: params.clienteId,
      usuarioId: params.usuarioId,
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
      .where(eq(Producto.id, params.productoId))
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
      ordenId: params.ordenId,
      productoId: params.productoId,
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

    await recalcularOrden(params.ordenId);
  };

  const cambiarEstadoOrden = async (ordenId: number, estado: OrdenEstado) => {
    const now = new Date().toISOString();
    await db
      .update(Orden)
      .set({ estado, updatedAt: now })
      .where(eq(Orden.id, ordenId));
  };

  const recalcularOrden = async (ordenId: number) => {
    const productos = await db
      .select()
      .from(OrdenProducto)
      .where(eq(OrdenProducto.ordenId, ordenId));

    const subtotal = productos.reduce((sum, p) => sum + p.subtotal, 0);
    const iva = productos.reduce((sum, p) => sum + p.iva, 0);
    const total = productos.reduce((sum, p) => sum + p.total, 0);
    const now = new Date().toISOString();

    await db
      .update(Orden)
      .set({ subtotal, iva, total, updatedAt: now })
      .where(eq(Orden.id, ordenId));
  };

  const cerrarOrden = async (ordenId: number) => {
    await cambiarEstadoOrden(ordenId, 'ENTREGADO');
  };

  const obtenerOrdenPorId = async (ordenId: number) => {
    const [orden] = await db
      .select()
      .from(Orden)
      .where(eq(Orden.id, ordenId))
      .limit(1);

    if (!orden) return null;

    const productos = await db
      .select()
      .from(OrdenProducto)
      .where(eq(OrdenProducto.ordenId, ordenId));

    const productosConDetalle = await Promise.all(
      productos.map(async (op) => {
        const [producto] = await db
          .select()
          .from(Producto)
          .where(eq(Producto.id, op.productoId))
          .limit(1);
        return { ...op, producto };
      })
    );

    return { ...orden, ordenProductos: productosConDetalle };
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

  const obtenerOrdenConClienteYUsuario = async (ordenId: number) => {
    const [orden] = await db
      .select()
      .from(Orden)
      .where(eq(Orden.id, ordenId))
      .limit(1);

    if (!orden) return null;

    let cliente = null;
    let usuario = null;

    if (orden.clienteId) {
      [cliente] = await db
        .select()
        .from(Cliente)
        .where(eq(Cliente.id, orden.clienteId))
        .limit(1);
    }

    [usuario] = await db
      .select()
      .from(Usuario)
      .where(eq(Usuario.id, orden.usuarioId))
      .limit(1);

    return { ...orden, cliente, usuario };
  };

  const eliminarProductoDeOrden = async (ordenProductoId: number) => {
    const [ordenProducto] = await db
      .select()
      .from(OrdenProducto)
      .where(eq(OrdenProducto.id, ordenProductoId))
      .limit(1);

    if (!ordenProducto) throw new Error('Producto en orden no encontrado');

    await db
      .delete(OrdenProducto)
      .where(eq(OrdenProducto.id, ordenProductoId));

    await recalcularOrden(ordenProducto.ordenId);
  };

  const cancelarOrden = async (ordenId: number) => {
    await cambiarEstadoOrden(ordenId, 'CANCELADO');
  };

  return {
    crearOrden,
    agregarProductoAOrden,
    cambiarEstadoOrden,
    recalcularOrden,
    cerrarOrden,
    obtenerOrdenPorId,
    obtenerOrdenesPorEstado,
    obtenerOrdenConClienteYUsuario,
    eliminarProductoDeOrden,
    cancelarOrden,
  };
}
