import { eq, asc } from 'drizzle-orm';
import { useDrizzle } from '@/db/db';
import { Pago, TipoPago } from '@/db/schema';
import { v4 as uuidv4 } from 'uuid';

type PagoEstado = 'PENDIENTE' | 'COMPLETADO' | 'ANULADO';

interface ProcesarPagoParams {
  ordenUuid?: string;
  facturaUuid?: string;
  tipoPagoUuid: string;
  monto: number;
  referencia?: string;
}

export function usePagoService() {
  const db = useDrizzle();

  const procesarPago = async (params: ProcesarPagoParams) => {
    const uuid = uuidv4();
    const now = new Date().toISOString();

    const result = await db.insert(Pago).values({
      uuid,
      ordenUuid: params.ordenUuid,
      facturaUuid: params.facturaUuid,
      tipoPagoUuid: params.tipoPagoUuid,
      monto: params.monto,
      referencia: params.referencia,
      estado: 'COMPLETADO',
      fechaPago: now,
      createdAt: now,
      updatedAt: now,
    });

    return result.lastInsertRowId;
  };

  const obtenerPagosPorOrden = async (ordenUuid: string) => {
    return db
      .select()
      .from(Pago)
      .where(eq(Pago.ordenUuid, ordenUuid))
      .orderBy(asc(Pago.fechaPago));
  };

  const obtenerPagosPorFactura = async (facturaUuid: string) => {
    return db
      .select()
      .from(Pago)
      .where(eq(Pago.facturaUuid, facturaUuid))
      .orderBy(asc(Pago.fechaPago));
  };

  const actualizarEstadoPago = async (pagoUuid: string, estado: PagoEstado) => {
    const now = new Date().toISOString();
    await db
      .update(Pago)
      .set({ estado, updatedAt: now })
      .where(eq(Pago.uuid, pagoUuid));
  };

  const obtenerTiposPago = async () => {
    return db
      .select()
      .from(TipoPago)
      .where(eq(TipoPago.activo, 1))
      .orderBy(asc(TipoPago.nombre));
  };

  const obtenerTipoPagoPorUuid = async (tipoPagoUuid: string) => {
    const [tipoPago] = await db
      .select()
      .from(TipoPago)
      .where(eq(TipoPago.uuid, tipoPagoUuid))
      .limit(1);
    return tipoPago || null;
  };

  const crearTipoPago = async (nombre: string) => {
    const uuid = uuidv4();
    const now = new Date().toISOString();

    const result = await db.insert(TipoPago).values({
      uuid,
      nombre,
      activo: 1,
      createdAt: now,
      updatedAt: now,
    });

    return result.lastInsertRowId;
  };

  return {
    procesarPago,
    obtenerPagosPorOrden,
    obtenerPagosPorFactura,
    actualizarEstadoPago,
    obtenerTiposPago,
    obtenerTipoPagoPorUuid,
    crearTipoPago,
  };
}
