import { eq, asc, sql } from 'drizzle-orm';
import { useDrizzle } from '@/db/db';
import { Factura, Orden, Cliente } from '@/db/schema';
import { v4 as uuidv4 } from 'uuid';

type EstadoSri = 'PENDIENTE' | 'AUTORIZADA' | 'RECHAZADA';

interface CrearFacturaParams {
  ordenUuid: string;
  clienteUuid: string;
}

export function useFacturaService() {
  const db = useDrizzle();

  const crearFactura = async (params: CrearFacturaParams) => {
    const [orden] = await db
      .select()
      .from(Orden)
      .where(eq(Orden.uuid, params.ordenUuid))
      .limit(1);

    if (!orden) throw new Error('Orden no encontrada');

    const [cliente] = await db
      .select()
      .from(Cliente)
      .where(eq(Cliente.uuid, params.clienteUuid))
      .limit(1);

    if (!cliente) throw new Error('Cliente no encontrado');

    const uuid = uuidv4();
    const now = new Date().toISOString();
    const numeroFactura = await generarNumeroFactura();
    const claveAcceso = generarClaveAcceso();

    const result = await db.insert(Factura).values({
      uuid,
      numeroFactura,
      claveAcceso,
      clienteUuid: params.clienteUuid,
      ordenUuid: params.ordenUuid,
      fechaEmision: now,
      subtotal0: 0,
      subtotalIva: orden.subtotal,
      subtotal: orden.subtotal,
      descuento: 0,
      iva: orden.iva,
      total: orden.total,
      estadoSri: 'PENDIENTE',
      createdAt: now,
      updatedAt: now,
    });

    return result.lastInsertRowId;
  };

  const obtenerFacturaPorUuid = async (facturaUuid: string) => {
    const [factura] = await db
      .select()
      .from(Factura)
      .where(eq(Factura.uuid, facturaUuid))
      .limit(1);
    return factura || null;
  };

  const obtenerFacturasPorOrden = async (ordenUuid: string) => {
    return db
      .select()
      .from(Factura)
      .where(eq(Factura.ordenUuid, ordenUuid));
  };

  const obtenerFacturasPorCliente = async (clienteUuid: string) => {
    return db
      .select()
      .from(Factura)
      .where(eq(Factura.clienteUuid, clienteUuid))
      .orderBy(asc(Factura.fechaEmision));
  };

  const actualizarEstadoSri = async (facturaUuid: string, estado: EstadoSri) => {
    const now = new Date().toISOString();
    await db
      .update(Factura)
      .set({ estadoSri: estado, updatedAt: now })
      .where(eq(Factura.uuid, facturaUuid));
  };

  const generarNumeroFactura = async (): Promise<string> => {
    const ultimo = await db
      .select({ max: sql<number>`MAX(${Factura.numeroFactura})` })
      .from(Factura);

    const ultimoNumero = (ultimo[0]?.max || 0).toString();
    const siguienteNumero = parseInt(ultimoNumero, 10) + 1;
    const numeroFormateado = siguienteNumero.toString().padStart(9, '0');

    return `001-001-${numeroFormateado}`;
  };

  const generarClaveAcceso = (): string => {
    const fecha = new Date();
    const fechaStr = fecha.toISOString().split('T')[0].replace(/-/g, '');
    const random = Math.floor(Math.random() * 99999999999999)
      .toString()
      .padStart(14, '0');
    return `${fechaStr}${random}`;
  };

  const obtenerTodasLasFacturas = async () => {
    return db.select().from(Factura).orderBy(asc(Factura.fechaEmision));
  };

  return {
    crearFactura,
    obtenerFacturaPorUuid,
    obtenerFacturasPorOrden,
    obtenerFacturasPorCliente,
    actualizarEstadoSri,
    generarNumeroFactura,
    obtenerTodasLasFacturas,
  };
}
