import { eq, asc } from 'drizzle-orm';
import { useDrizzle } from '@/db/db';
import { Pago, TipoPago } from '@/db/schema';
import { v4 as uuidv4 } from 'uuid';

type PagoEstado = 'PENDIENTE' | 'COMPLETADO' | 'ANULADO';

interface ProcesarPagoParams {
  ordenId?: number;
  facturaId?: number;
  tipoPagoId: number;
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
      ordenId: params.ordenId,
      facturaId: params.facturaId,
      tipoPagoId: params.tipoPagoId,
      monto: params.monto,
      referencia: params.referencia,
      estado: 'COMPLETADO',
      fechaPago: now,
      createdAt: now,
      updatedAt: now,
    });

    return result.lastInsertRowId;
  };

  const obtenerPagosPorOrden = async (ordenId: number) => {
    return db
      .select()
      .from(Pago)
      .where(eq(Pago.ordenId, ordenId))
      .orderBy(asc(Pago.fechaPago));
  };

  const obtenerPagosPorFactura = async (facturaId: number) => {
    return db
      .select()
      .from(Pago)
      .where(eq(Pago.facturaId, facturaId))
      .orderBy(asc(Pago.fechaPago));
  };

  const actualizarEstadoPago = async (pagoId: number, estado: PagoEstado) => {
    const now = new Date().toISOString();
    await db
      .update(Pago)
      .set({ estado, updatedAt: now })
      .where(eq(Pago.id, pagoId));
  };

  const obtenerTiposPago = async () => {
    return db
      .select()
      .from(TipoPago)
      .where(eq(TipoPago.activo, 1))
      .orderBy(asc(TipoPago.nombre));
  };

  const obtenerTipoPagoPorId = async (tipoPagoId: number) => {
    const [tipoPago] = await db
      .select()
      .from(TipoPago)
      .where(eq(TipoPago.id, tipoPagoId))
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
    obtenerTipoPagoPorId,
    crearTipoPago,
  };
}
