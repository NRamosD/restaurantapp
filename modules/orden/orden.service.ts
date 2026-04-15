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

interface SyncOrdenProductoItem {
  uuid?: string;
  productoUuid: string;
  cantidad?: number;
  notas?: string | null;
}

export function useOrdenService() {
  const db = useDrizzle();

  const calcularTotalesProducto = (producto: typeof Producto.$inferSelect, cantidad: number) => {
    const precioUnitario = producto.precio;
    const aplicaIva = producto.aplicaIva === 1;
    const porcentajeIva = producto.porcentajeIva ?? 0;
    const descuento = 0;
    const subtotal = precioUnitario * cantidad;
    const iva = aplicaIva ? Math.round(subtotal * (porcentajeIva / 100)) : 0;
    const total = subtotal + iva;

    return {
      precioUnitario,
      descuento,
      subtotal,
      iva,
      total,
    };
  };

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

    return {
      id: result.lastInsertRowId,
      uuid,
    };
  };

  const agregarProductoAOrden = async (params: AgregarProductoParams) => {
    const [producto] = await db
      .select()
      .from(Producto)
      .where(eq(Producto.uuid, params.productoUuid))
      .limit(1);

    if (!producto) throw new Error('Producto no encontrado');
    if (producto.estado !== 'DISPONIBLE') throw new Error('Producto no disponible');

    const cantidad = params.cantidad;
    const { precioUnitario, descuento, subtotal, iva, total } = calcularTotalesProducto(producto, cantidad);

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

  const actualizarProductoDeOrden = async (ordenProductoUuid: string, params: Omit<AgregarProductoParams, 'ordenUuid'>) => {
    const [ordenProducto] = await db
      .select()
      .from(OrdenProducto)
      .where(eq(OrdenProducto.uuid, ordenProductoUuid))
      .limit(1);

    if (!ordenProducto) throw new Error('Producto en orden no encontrado');

    const [producto] = await db
      .select()
      .from(Producto)
      .where(eq(Producto.uuid, params.productoUuid))
      .limit(1);

    if (!producto) throw new Error('Producto no encontrado');
    if (producto.estado !== 'DISPONIBLE') throw new Error('Producto no disponible');

    const now = new Date().toISOString();
    const cantidad = params.cantidad;
    const { precioUnitario, descuento, subtotal, iva, total } = calcularTotalesProducto(producto, cantidad);

    await db
      .update(OrdenProducto)
      .set({
        productoUuid: params.productoUuid,
        cantidad,
        precioUnitario,
        descuento,
        subtotal,
        iva,
        total,
        notas: params.notas,
        updatedAt: now,
      })
      .where(eq(OrdenProducto.uuid, ordenProductoUuid));
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

  const sincronizarProductosDeOrden = async (ordenUuid: string, items: SyncOrdenProductoItem[], observaciones?:string) => {
    const productosActuales = await db
      .select()
      .from(OrdenProducto)
      .where(eq(OrdenProducto.ordenUuid, ordenUuid));
    
    if (!!observaciones) {
      await db
        .update(Orden)
        .set({ observaciones, updatedAt: new Date().toISOString() })
        .where(eq(Orden.uuid, ordenUuid));
    }

    const productosActualesPorUuid = new Map(productosActuales.map((item) => [item.uuid, item]));
    const productosActualesPorProductoUuid = new Map(productosActuales.map((item) => [item.productoUuid, item]));
    const productoUuidsEnPayload = new Set<string>();

    for (const item of items) {
      if (!item.productoUuid) {
        continue;
      }

      productoUuidsEnPayload.add(item.productoUuid);

      const existente = (item.uuid ? productosActualesPorUuid.get(item.uuid) : undefined)
        ?? productosActualesPorProductoUuid.get(item.productoUuid);

      if (existente) {
        await actualizarProductoDeOrden(existente.uuid, {
          productoUuid: item.productoUuid,
          cantidad: item.cantidad ?? 1,
          notas: item.notas ?? undefined,
        });
        continue;
      }

      await agregarProductoAOrden({
        ordenUuid,
        productoUuid: item.productoUuid,
        cantidad: item.cantidad ?? 1,
        notas: item.notas ?? undefined,
      });
    }

    const productosAEliminar = productosActuales.filter(
      (item) => !productoUuidsEnPayload.has(item.productoUuid)
    );

    for (const item of productosAEliminar) {
      await db.delete(OrdenProducto).where(eq(OrdenProducto.uuid, item.uuid));
    }

    await recalcularOrden(ordenUuid);
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
    actualizarProductoDeOrden,
    cambiarEstadoOrden,
    recalcularOrden,
    sincronizarProductosDeOrden,
    cerrarOrden,
    obtenerOrdenPorUuid,
    obtenerOrdenesPorEstado,
    obtenerOrdenesPorFecha,
    obtenerOrdenConClienteYUsuario,
    eliminarProductoDeOrden,
    cancelarOrden,
  };
}
