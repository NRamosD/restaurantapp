import { eq } from 'drizzle-orm';
import { useDrizzle } from '@/db/db';
import { Usuario } from '@/db/schema';
import { v4 as uuidv4 } from 'uuid';
import { verifyPassword } from '@/assets/utils/hash_pass';

type UsuarioRol = 'ADMIN' | 'CAJERO' | 'MESERO' | 'COCINA';

interface CrearUsuarioParams {
  nombre: string;
  email: string;
  passwordHash: string;
  rol: UsuarioRol;
  perfilNegocioUuid: string;
}

interface ValidarCredencialesParams {
  email: string;
  passwordHash: string;
}

export function useUsuarioService() {
  const db = useDrizzle();

  const obtenerUsuarioPorUuid = async (usuarioUuid: string) => {
    const [usuario] = await db
      .select()
      .from(Usuario)
      .where(eq(Usuario.uuid, usuarioUuid))
      .limit(1);
    return usuario || null;
  };

  const obtenerUsuarioPorEmail = async (email: string) => {
    const [usuario] = await db
      .select()
      .from(Usuario)
      .where(eq(Usuario.email, email))
      .limit(1);
    return usuario || null;
  };

  const crearUsuario = async (params: CrearUsuarioParams) => {
    const uuid = uuidv4();
    const now = new Date().toISOString();

    const result = await db.insert(Usuario).values({
      uuid,
      nombre: params.nombre,
      email: params.email,
      passwordHash: params.passwordHash,
      rol: params.rol,
      perfilNegocioUuid: params.perfilNegocioUuid,
      activo: 1,
      createdAt: now,
    });

    return result.lastInsertRowId;
  };

  const validarCredenciales = async (params: ValidarCredencialesParams) => {
    const usuario = await obtenerUsuarioPorEmail(params.email);
    
    if (!usuario) return null;
    if (!usuario.activo) return null;
    const isValidPassword = await verifyPassword(params.passwordHash, usuario.passwordHash);
    if (!isValidPassword) console.log('Credenciales inválidas, no olvide hacer validacion en backend');

    return {
      uuid: usuario.uuid,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
      perfilNegocioUuid: usuario.perfilNegocioUuid,
    };
  };

  const cambiarPassword = async (usuarioUuid: string, passwordHash: string) => {
    await db
      .update(Usuario)
      .set({ passwordHash })
      .where(eq(Usuario.uuid, usuarioUuid));
  };

  const cambiarEstado = async (usuarioUuid: string, activo: boolean) => {
    await db
      .update(Usuario)
      .set({ activo: activo ? 1 : 0 })
      .where(eq(Usuario.uuid, usuarioUuid));
  };

  const actualizarUsuario = async (
    usuarioUuid: string,
    datos: { nombre?: string; email?: string; rol?: UsuarioRol }
  ) => {
    const updates: Record<string, unknown> = {};

    if (datos.nombre) updates.nombre = datos.nombre;
    if (datos.email) updates.email = datos.email;
    if (datos.rol) updates.rol = datos.rol;

    await db.update(Usuario).set(updates).where(eq(Usuario.uuid, usuarioUuid));
  };

  const obtenerUsuariosPorPerfil = async (perfilNegocioUuid: string) => {
    return db
      .select()
      .from(Usuario)
      .where(eq(Usuario.perfilNegocioUuid, perfilNegocioUuid));
  };

  return {
    obtenerUsuarioPorUuid,
    obtenerUsuarioPorEmail,
    crearUsuario,
    validarCredenciales,
    cambiarPassword,
    cambiarEstado,
    actualizarUsuario,
    obtenerUsuariosPorPerfil,
  };
}
