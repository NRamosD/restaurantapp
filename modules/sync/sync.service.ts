import { eq, and } from 'drizzle-orm';
import { useDrizzle } from '@/db/db';
import { Orden, Factura, Pago, Cliente, Producto, OrdenProducto } from '@/db/schema';
import { mockSyncApi, mockSyncBatch, type SyncPayload } from './api.mock';
import { syncQueue, type SyncQueueItem } from './syncQueue';
import { useNetworkStatus } from './useNetworkStatus';

export type TablaSincronizable = 'orden' | 'factura' | 'pago' | 'cliente' | 'producto' | 'orden_producto';

export interface EstadisticasSync {
  totalPendientes: number;
  porTabla: Record<TablaSincronizable, number>;
  ultimaSincronizacion: string | null;
}

export function useSyncService() {
  const db = useDrizzle();
  const { isConnected, isInternetReachable } = useNetworkStatus();

  const isOnline = isConnected && isInternetReachable;

  const obtenerPendientesPorTabla = async (tabla: TablaSincronizable) => {
    switch (tabla) {
      case 'orden':
        return db.select().from(Orden).where(eq(Orden.estadoSync, 'PENDIENTE'));
      case 'factura':
        return db.select().from(Factura).where(eq(Factura.estadoSync, 'PENDIENTE'));
      case 'pago':
        return db.select().from(Pago).where(eq(Pago.estadoSync, 'PENDIENTE'));
      case 'cliente':
        return db.select().from(Cliente).where(eq(Cliente.estadoSync, 'PENDIENTE'));
      case 'producto':
        return db.select().from(Producto).where(eq(Producto.estadoSync, 'PENDIENTE'));
      default:
        return [];
    }
  };

  const obtenerTodosPendientes = async (): Promise<Record<TablaSincronizable, unknown[]>> => {
    const [ordenes, facturas, pagos, clientes, productos] = await Promise.all([
      db.select().from(Orden).where(eq(Orden.estadoSync, 'PENDIENTE')),
      db.select().from(Factura).where(eq(Factura.estadoSync, 'PENDIENTE')),
      db.select().from(Pago).where(eq(Pago.estadoSync, 'PENDIENTE')),
      db.select().from(Cliente).where(eq(Cliente.estadoSync, 'PENDIENTE')),
      db.select().from(Producto).where(eq(Producto.estadoSync, 'PENDIENTE')),
    ]);

    return {
      orden: ordenes,
      factura: facturas,
      pago: pagos,
      cliente: clientes,
      producto: productos,
      orden_producto: [],
    };
  };

  const marcarComoSincronizado = async (tabla: TablaSincronizable, ids: number[]) => {
    const now = new Date().toISOString();

    for (const id of ids) {
      switch (tabla) {
        case 'orden':
          await db.update(Orden).set({ estadoSync: 'SINCRONIZADO', updatedAt: now }).where(eq(Orden.id, id));
          break;
        case 'factura':
          await db.update(Factura).set({ estadoSync: 'SINCRONIZADO', updatedAt: now }).where(eq(Factura.id, id));
          break;
        case 'pago':
          await db.update(Pago).set({ estadoSync: 'SINCRONIZADO', updatedAt: now }).where(eq(Pago.id, id));
          break;
        case 'cliente':
          await db.update(Cliente).set({ estadoSync: 'SINCRONIZADO', updatedAt: now }).where(eq(Cliente.id, id));
          break;
        case 'producto':
          await db.update(Producto).set({ estadoSync: 'SINCRONIZADO', updatedAt: now }).where(eq(Producto.id, id));
          break;
      }
    }
  };

  const sincronizarTabla = async (tabla: TablaSincronizable): Promise<{ success: boolean; sincronizados: number; errores: number }> => {
    if (!isOnline) {
      console.log(`[Sync] Sin conexión - guardando ${tabla} en cola`);
      return { success: false, sincronizados: 0, errores: 0 };
    }

    const pendientes = await obtenerPendientesPorTabla(tabla);
    if (pendientes.length === 0) {
      return { success: true, sincronizados: 0, errores: 0 };
    }

    console.log(`[Sync] Sincronizando ${pendientes.length} ${tabla}(s)...`);

    const payloads: SyncPayload[] = pendientes.map((record) => ({
      table: tabla,
      id: (record as { id: number }).id,
      data: record as Record<string, unknown>,
    }));

    try {
      const response = await mockSyncBatch(payloads);

      if (response.success) {
        const ids = pendientes.map((p) => (p as { id: number }).id);
        await marcarComoSincronizado(tabla, ids);
        console.log(`[Sync] ${tabla} sincronizados: ${ids.length}`);
        return { success: true, sincronizados: ids.length, errores: 0 };
      }

      return { success: false, sincronizados: 0, errores: pendientes.length };
    } catch (error) {
      console.error(`[Sync] Error sincronizando ${tabla}:`, error);
      return { success: false, sincronizados: 0, errores: pendientes.length };
    }
  };

  const sincronizarOrdenes = async () => sincronizarTabla('orden');
  const sincronizarFacturas = async () => sincronizarTabla('factura');
  const sincronizarPagos = async () => sincronizarTabla('pago');
  const sincronizarClientes = async () => sincronizarTabla('cliente');
  const sincronizarProductos = async () => sincronizarTabla('producto');

  const sincronizarTodo = async (): Promise<{ success: boolean; resultados: Record<TablaSincronizable, { sincronizados: number; errores: number }> }> => {
    if (!isOnline) {
      console.log('[Sync] Sin conexión para sincronización completa');
      return { 
        success: false, 
        resultados: {
          orden: { sincronizados: 0, errores: 0 },
          factura: { sincronizados: 0, errores: 0 },
          pago: { sincronizados: 0, errores: 0 },
          cliente: { sincronizados: 0, errores: 0 },
          producto: { sincronizados: 0, errores: 0 },
          orden_producto: { sincronizados: 0, errores: 0 },
        } 
      };
    }

    console.log('[Sync] Iniciando sincronización completa...');

    const resultados: Record<TablaSincronizable, { sincronizados: number; errores: number }> = {
      orden: { sincronizados: 0, errores: 0 },
      factura: { sincronizados: 0, errores: 0 },
      pago: { sincronizados: 0, errores: 0 },
      cliente: { sincronizados: 0, errores: 0 },
      producto: { sincronizados: 0, errores: 0 },
      orden_producto: { sincronizados: 0, errores: 0 },
    };

    const ordenResult = await sincronizarOrdenes();
    resultados.orden = { sincronizados: ordenResult.sincronizados, errores: ordenResult.errores };

    const facturaResult = await sincronizarFacturas();
    resultados.factura = { sincronizados: facturaResult.sincronizados, errores: facturaResult.errores };

    const pagoResult = await sincronizarPagos();
    resultados.pago = { sincronizados: pagoResult.sincronizados, errores: pagoResult.errores };

    const clienteResult = await sincronizarClientes();
    resultados.cliente = { sincronizados: clienteResult.sincronizados, errores: clienteResult.errores };

    const productoResult = await sincronizarProductos();
    resultados.producto = { sincronizados: productoResult.sincronizados, errores: productoResult.errores };

    const totalErrores = Object.values(resultados).reduce((sum, r) => sum + r.errores, 0);
    const sincronizados = Object.values(resultados).reduce((sum, r) => sum + r.sincronizados, 0);

    console.log(`[Sync] Completado. Sincronizados: ${sincronizados}, Errores: ${totalErrores}`);

    return { success: totalErrores === 0, resultados };
  };

  const sincronizacionAutomatica = async (): Promise<void> => {
    console.log('[Sync] Ejecutando sincronización automática...');
    await sincronizarTodo();
  };

  const sincronizacionManual = async () => {
    console.log('[Sync] Ejecutando sincronización manual...');
    return sincronizarTodo();
  };

  const obtenerEstadisticas = async (): Promise<EstadisticasSync> => {
    const pendientes = await obtenerTodosPendientes();

    return {
      totalPendientes: Object.values(pendientes).reduce((sum, arr) => sum + arr.length, 0),
      porTabla: {
        orden: pendientes.orden.length,
        factura: pendientes.factura.length,
        pago: pendientes.pago.length,
        cliente: pendientes.cliente.length,
        producto: pendientes.producto.length,
        orden_producto: 0,
      },
      ultimaSincronizacion: null,
    };
  };

  return {
    isOnline,
    obtenerPendientesPorTabla,
    obtenerTodosPendientes,
    sincronizarOrdenes,
    sincronizarFacturas,
    sincronizarPagos,
    sincronizarClientes,
    sincronizarProductos,
    sincronizarTodo,
    sincronizacionAutomatica,
    sincronizacionManual,
    obtenerEstadisticas,
    marcarComoSincronizado,
  };
}
