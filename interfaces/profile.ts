// Perfil
export interface Perfil {
    id_perfil?: number; // autoincrement, opcional al crear
    id_usuario: number;
    id_negocio?: number | null;
    uuid: string;
    correo: string;
    telefono?: string | null;
    nombre_perfil: string;
    password_perfil: string;
    tipo_perfil: "admin" | "cliente" | "empleado" | string; // puedes restringir más si quieres
    tipo_negocio?: string | null;
    estado?: string; // default "activo"
    valores_configuraciones: string; // podrías tipar como JSON.parse() => Record<string, any>
    auth: string;
    fecha_creacion?: string; // SQLite almacena DATETIME como string
}

