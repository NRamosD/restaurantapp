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
  perfilNegocioId: number;
}

interface ValidarCredencialesParams {
  email: string;
  passwordHash: string;
}

export function useUsuarioService() {
  const db = useDrizzle();

  const obtenerUsuarioPorId = async (usuarioId: number) => {
    const [usuario] = await db
      .select()
      .from(Usuario)
      .where(eq(Usuario.id, usuarioId))
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
      perfilNegocioId: params.perfilNegocioId,
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
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
      perfilNegocioId: usuario.perfilNegocioId,
    };
  };

  const cambiarPassword = async (usuarioId: number, passwordHash: string) => {
    await db
      .update(Usuario)
      .set({ passwordHash })
      .where(eq(Usuario.id, usuarioId));
  };

  const cambiarEstado = async (usuarioId: number, activo: boolean) => {
    await db
      .update(Usuario)
      .set({ activo: activo ? 1 : 0 })
      .where(eq(Usuario.id, usuarioId));
  };

  const actualizarUsuario = async (
    usuarioId: number,
    datos: { nombre?: string; email?: string; rol?: UsuarioRol }
  ) => {
    const updates: Record<string, unknown> = {};

    if (datos.nombre) updates.nombre = datos.nombre;
    if (datos.email) updates.email = datos.email;
    if (datos.rol) updates.rol = datos.rol;

    await db.update(Usuario).set(updates).where(eq(Usuario.id, usuarioId));
  };

  const obtenerUsuariosPorPerfil = async (perfilNegocioId: number) => {
    return db
      .select()
      .from(Usuario)
      .where(eq(Usuario.perfilNegocioId, perfilNegocioId));
  };

  return {
    obtenerUsuarioPorId,
    obtenerUsuarioPorEmail,
    crearUsuario,
    validarCredenciales,
    cambiarPassword,
    cambiarEstado,
    actualizarUsuario,
    obtenerUsuariosPorPerfil,
  };
}
