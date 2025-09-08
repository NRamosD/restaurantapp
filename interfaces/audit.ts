export interface Auditoria {
    uuid: string;                     // único
    tabla_afectada: string;
    operacion: "CREATE"|"INSERT" | "UPDATE" | "DELETE";
    id_perfil?: number | null;        // FK a Perfil, opcional
    cambio_anterior?: string | null;
    fecha_creacion?: string;          // DATETIME, default CURRENT_TIMESTAMP
    detalle?: string | null;
}
  