export interface PerfilNegocio {
    id: number;
    uuid: string;
    nombre_comercial: string;
    razon_social: string;
    ruc: string;
    direccion: string;
    telefono?: string;
    email?: string;

    obligado_contabilidad: boolean;
    regimen_rimpe?: boolean;

    ambiente: 'PRUEBAS' | 'PRODUCCION';
    tipo_emision: 'NORMAL' | 'CONTINGENCIA';

    secuencia_factura_actual: number;
    secuencia_orden_actual: number;

    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
}


export interface Usuario {
    id: number;
    uuid: string;
    nombre: string;
    email: string;
    password_hash: string;

    rol: 'ADMIN' | 'CAJERO' | 'MESERO' | 'COCINA';

    perfil_negocio_id: number;

    activo: boolean;
    created_at: Date;
    deleted_at?: Date;
}

export interface Sesion {
    id: number;
    uuid: string;

    usuario_id: number;

    token: string;

    expira_en: Date;

    ultimo_login: Date;

    activo: boolean;
    estado_sync: 'PENDIENTE' | 'SINCRONIZADO'; 
    deleted_at?: Date;
}

export interface Permiso {
    id: number;
    uuid: string;
    // ej: "CREAR_ORDEN", "VER_REPORTES", "FACTURAR"

    descripcion?: string;
    created_at: Date;
    updated_at: Date;
    updated_by?: number;
    deleted_at?: Date;
}

export interface UsuarioPermiso {
    id: number;
    uuid: string;

    usuario_id: number;
    permiso_id: number;
    deleted_at?: Date;
}


export interface Cliente {
    id: number;
    uuid: string;
    nombre: string;
    tipo_identificacion: 'CEDULA' | 'RUC' | 'PASAPORTE' | 'CONSUMIDOR_FINAL';
    identificacion: string;

    direccion?: string;
    telefono?: string;
    email?: string;
    estado_sync: 'PENDIENTE' | 'SINCRONIZADO';

    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
}


export interface Producto {
    id: number;
    uuid: string;

    nombre: string;
    descripcion?: string;

    precio: number; // en centavos
    aplica_iva: boolean;
    porcentaje_iva: number;

    stock: number;
    ilimitado: boolean;

    imagen_url?: string;
    galeria?: string[];

    estado: 'DISPONIBLE' | 'NO_DISPONIBLE';

    perfil_negocio_id: number;

    estado_sync: 'PENDIENTE' | 'SINCRONIZADO';

    created_at: Date;
    updated_at?: Date;
    updated_by?: number;
    deleted_at?: Date;
}


export interface Componente {
    id: number;
    uuid: string;
    nombre: string;
    unidad_medida: string; // g, ml, unidad

    stock_actual: number;
    stock_minimo: number;

    costo_unitario: number;
    perfil_negocio_id: number;


    created_at: Date;
    deleted_at?: Date;
}

export interface ProductoComponente {
    id: number;
    uuid: string;
    producto_id: number;
    componente_id: number;

    cantidad: number;
    estado_sync?: 'PENDIENTE' | 'SINCRONIZADO';
    created_at: Date;
    updated_at: Date;
    updated_by?: number;
    deleted_at?: Date;
}


export interface Orden {
    id: number;
    uuid: string;
    numero_orden?: number;

    cliente_id?: number;
    usuario_id: number;

    tipo: 'LOCAL' | 'LLEVAR' | 'DELIVERY';

    estado: 'PENDIENTE' | 'EN_PREPARACION' | 'LISTO' | 'ENTREGADO' | 'CANCELADO';
    estado_sync: 'PENDIENTE' | 'SINCRONIZADO';

    subtotal: number;
    iva: number;
    total: number;

    observaciones?: string;

    created_at: Date;
    updated_at: Date;
    updated_by?: number;
    deleted_at?: Date;
}


export interface OrdenProducto {
    id: number;
    uuid: string;

    orden_id: number;
    producto_id: number;

    cantidad: number;
    precio_unitario: number;

    descuento: number;
    subtotal: number;
    iva: number;
    total: number;
    estado_sync: 'PENDIENTE' | 'SINCRONIZADO';

    notas?: string;
    created_at: Date;
    updated_at: Date;
    updated_by?: number;
    deleted_at?: Date;
}


export interface Factura {
    id: number;
    uuid: string;

    numero_factura: string; // 001-001-000000123
    clave_acceso: string;

    cliente_id: number;
    orden_id?: number;

    fecha_emision: Date;

    subtotal_0: number;
    subtotal_iva: number;
    subtotal: number;

    descuento: number;
    iva: number;
    total: number;

    estado_sri: 'PENDIENTE' | 'AUTORIZADA' | 'RECHAZADA';
    estado_sync: 'PENDIENTE' | 'SINCRONIZADO';

    // xml?: string;
    pdf_url?: string;

    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
}


export interface Pago {
    id: number;
    uuid: string;

    orden_id?: number;
    factura_id?: number;

    tipo_pago_id: number;

    monto: number;
    referencia?: string;

    estado: 'PENDIENTE' | 'COMPLETADO' | 'ANULADO';
    estado_sync: 'PENDIENTE' | 'SINCRONIZADO';

    fecha_pago: Date;
    created_at: Date;
    updated_at: Date;
    updated_by?: number;
    deleted_at?: Date;
}

export interface TipoPago {
    id: number;
    uuid: string;
    nombre: string; // EFECTIVO, TARJETA, TRANSFERENCIA, etc.
    activo: boolean;
    created_at: Date;
    updated_at: Date;
    updated_by?: number;
    deleted_at?: Date;
}





export interface Plan {
    id: number;
    uuid: string;
    nombre: string;

    activo: boolean;
    perfil_negocio_id?: number;
    updated_at: Date;
    deleted_at?: Date;
}


export interface Feature {
    id: number;

    uuid: string;
    // ej: "MODULO_FACTURACION", "DELIVERY", "REPORTES"

    habilitado: boolean;
    perfil_negocio_id?: number;
    updated_at: Date;
    deleted_at?: Date;
}


// export interface PlanFeature {
// uuid: string;
//   id: number;
//   plan_id: number;
//   feature_id: number;
// deleted_at?: Date;
// }

// export interface Suscripcion {
// uuid: string;
//   id: number;
//   perfil_negocio_id: number;
//   plan_id: number;

//   fecha_inicio: Date;
//   fecha_fin: Date;

//   estado: 'ACTIVA' | 'VENCIDA' | 'CANCELADA';
// deleted_at?: Date;
// }



// export interface Auditoria {
// uuid: string;
//   id: number;

//   actor_id: number;
//   action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'UPGRADE_PLAN';

//   entity_type: string;
//   entity_id: number;

// deleted_at?: Date;
//   changes?: Record<string, { before: any; after: any }>;

//   ip_address?: string;
//   user_agent?: string;

//   created_at: Date;
// deleted_at?: Date;
// }


// export interface Perfil {
// uuid: string;
//   id: number;
//   usuario_id: number;

//   nombre: string;
//   telefono?: string;

//   preferencias?: Record<string, any>;
// deleted_at?: Date;
// }


// export interface ConfiguracionPerfil {
// uuid: string;
//   id: number;
//   perfil_id: number;

//   clave: string;
//   valor: string;
// deleted_at?: Date;
// }

// export interface Plan {
// uuid: string;
//   id: number;
//   nombre: string;

//   precio: number;
//   intervalo: 'MENSUAL' | 'ANUAL';

//   limite_usuarios?: number;
//   limite_productos?: number;

//   activo: boolean;
// deleted_at?: Date;
// }

// export interface Feature {
// uuid: string;
//   id: number;
//   nombre: string;
//   descripcion?: string;
// deleted_at?: Date;
// }