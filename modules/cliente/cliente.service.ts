import { eq, like, asc, or } from 'drizzle-orm';
import { useDrizzle } from '@/db/db';
import { Cliente } from '@/db/schema';
import { v4 as uuidv4 } from 'uuid';

type TipoIdentificacion = 'CEDULA' | 'RUC' | 'PASAPORTE' | 'CONSUMIDOR_FINAL';

interface CrearClienteParams {
  nombre: string;
  tipoIdentificacion: TipoIdentificacion;
  identificacion: string;
  direccion?: string;
  telefono?: string;
  email?: string;
}

interface ActualizarClienteParams {
  uuid: string;
  nombre?: string;
  tipoIdentificacion?: TipoIdentificacion;
  identificacion?: string;
  direccion?: string;
  telefono?: string;
  email?: string;
}

export function useClienteService() {
  const db = useDrizzle();

  const obtenerClientes = async () => {
    return db.select().from(Cliente).orderBy(asc(Cliente.nombre));
  };

  const obtenerClientePorUuid = async (clienteUuid: string) => {
    const [cliente] = await db
      .select()
      .from(Cliente)
      .where(eq(Cliente.uuid, clienteUuid))
      .limit(1);
    return cliente || null;
  };

  const buscarClientePorIdentificacion = async (identificacion: string) => {
    const [cliente] = await db
      .select()
      .from(Cliente)
      .where(eq(Cliente.identificacion, identificacion))
      .limit(1);
    return cliente || null;
  };

  const buscarClientes = async (termino: string) => {
    return db
      .select()
      .from(Cliente)
      .where(
        or(
          like(Cliente.nombre, `%${termino}%`),
          like(Cliente.identificacion, `%${termino}%`)
        )
      )
      .orderBy(asc(Cliente.nombre));
  };

  const crearCliente = async (params: CrearClienteParams) => {
    const uuid = uuidv4();
    const now = new Date().toISOString();

    const result = await db.insert(Cliente).values({
      uuid,
      nombre: params.nombre,
      tipoIdentificacion: params.tipoIdentificacion,
      identificacion: params.identificacion,
      direccion: params.direccion,
      telefono: params.telefono,
      email: params.email,
      createdAt: now,
      updatedAt: now,
    });

    return result.lastInsertRowId;
  };

  const actualizarCliente = async (params: ActualizarClienteParams) => {
    const now = new Date().toISOString();
    const updates: Record<string, unknown> = { updatedAt: now };

    if (params.nombre) updates.nombre = params.nombre;
    if (params.tipoIdentificacion) updates.tipoIdentificacion = params.tipoIdentificacion;
    if (params.identificacion) updates.identificacion = params.identificacion;
    if (params.direccion !== undefined) updates.direccion = params.direccion;
    if (params.telefono !== undefined) updates.telefono = params.telefono;
    if (params.email !== undefined) updates.email = params.email;

    await db.update(Cliente).set(updates).where(eq(Cliente.uuid, params.uuid));
  };

  const eliminarCliente = async (clienteUuid: string) => {
    const now = new Date().toISOString();
    await db
      .update(Cliente)
      .set({ deletedAt: now })
      .where(eq(Cliente.uuid, clienteUuid));
  };

  return {
    obtenerClientes,
    obtenerClientePorUuid,
    buscarClientePorIdentificacion,
    buscarClientes,
    crearCliente,
    actualizarCliente,
    eliminarCliente,
  };
}
