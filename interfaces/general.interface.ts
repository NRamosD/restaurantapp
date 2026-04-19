export interface PerfilNegocio {
    id: number;
    uuid: string;
    nombreComercial: string;
    razonSocial: string;
    ruc: string;
    direccion: string;
    telefono?: string;
    email?: string;

    obligadoContabilidad: boolean;
    regimenRimpe?: boolean;

    ambiente: 'PRUEBAS' | 'PRODUCCION';
    tipoEmision: 'NORMAL' | 'CONTINGENCIA';

    secuenciaFacturaActual: number;
    secuenciaOrdenActual: number;

    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}


export interface Usuario {
    id: number;
    uuid: string;
    nombre: string;
    email: string;
    passwordHash: string;

    rol: 'ADMIN' | 'CAJERO' | 'MESERO' | 'COCINA' | string;

    perfilNegocioUuid: string;

    activo: boolean | number | undefined;
    createdAt: Date | string;
    deletedAt?: Date | string | null;
}

export interface Sesion {
    id: number;
    uuid: string;

    usuarioUuid: string;

    token: string;

    expiraEn: Date;

    ultimoLogin: Date;

    activo: boolean;
    estadoSync: 'PENDIENTE' | 'SINCRONIZADO';
    deletedAt?: Date;
}

export interface Permiso {
    id: number;
    uuid: string;
    nombre: string;
    descripcion?: string;
    createdAt: Date;
    updatedAt: Date;
    updatedByUuid?: string;
    deletedAt?: Date;
}

export interface UsuarioPermiso {
    id: number;
    uuid: string;

    usuarioUuid: string;
    permisoUuid: string;
    deletedAt?: Date;
}


export interface Cliente {
    id: number;
    uuid: string;
    nombre: string;
    tipoIdentificacion: 'CEDULA' | 'RUC' | 'PASAPORTE' | 'CONSUMIDOR_FINAL' | string;
    identificacion: string;

    direccion?: string | null;
    telefono?: string | null;
    email?: string | null;
    estadoSync: 'PENDIENTE' | 'SINCRONIZADO' | string;

    createdAt: Date | string;
    updatedAt: Date | string;
    deletedAt?: Date | string | null;
}


export interface CategoriaProducto {
    id: number;
    uuid: string;
    nombre: string;
    slug: string;
    activo: boolean | number;
    createdAt: Date | string;
    updatedAt: Date | string;
    deletedAt?: Date | null | string;
}

export interface ProductoOpciones {
    id: number;
    uuid: string;
    productoUuid: string;
    nombre: string;
    descripcion?: string | null;
    valorAdicional: number;
    orden: number;
    activo: boolean | number;
    estadoSync: 'PENDIENTE' | 'SINCRONIZADO' | string;
    createdAt: Date | string;
    updatedAt: Date | string;
    updatedByUuid?: string | null;
    deletedAt?: Date | null | string;
}

export interface Producto {
    id: number;
    uuid: string;

    nombre: string;
    descripcion?: string | null;

    precio: number;
    aplicaIva: boolean | null | number;
    porcentajeIva: number | null;

    stock: number;
    ilimitado: boolean | null | number;

    imagenUrl?: string | null;
    galeria?: string[] | string | null;

    estado: 'DISPONIBLE' | 'NO_DISPONIBLE' | string;

    categoriaProductoUuid?: string | null;
    categoriaProducto?: Partial<CategoriaProducto> | null;
    productoOpciones?: Partial<ProductoOpciones>[] | null;

    perfilNegocioUuid: string;

    estadoSync: 'PENDIENTE' | 'SINCRONIZADO' | string;

    createdAt: Date | string;
    updatedAt?: Date | null | string;
    updatedByUuid?: string | null;
    deletedAt?: Date | null | string;
}


export interface Componente {
    id: number;
    uuid: string;
    nombre: string;
    unidadMedida: string;

    stockActual: number;
    stockMinimo: number;

    costoUnitario: number;
    perfilNegocioUuid: string;

    createdAt: Date;
    deletedAt?: Date;
}

export interface ProductoComponente {
    id: number;
    uuid: string;
    productoUuid: string;
    componenteUuid: string;

    cantidad: number;
    estadoSync?: 'PENDIENTE' | 'SINCRONIZADO';
    createdAt: Date;
    updatedAt: Date;
    updatedByUuid?: string;
    deletedAt?: Date;
}


export interface Orden {
    id: number;
    uuid: string;
    numeroOrden?: number|null;

    clienteUuid?: string | null;
    usuarioUuid: string;

    tipo: 'LOCAL' | 'LLEVAR' | 'DELIVERY' | string;

    estado: 'PENDIENTE' | 'EN_PREPARACION' | 'LISTO' | 'ENTREGADO' | 'COMPLETADO' | 'CANCELADO' | string;
    estadoSync: 'PENDIENTE' | 'SINCRONIZADO' | string;

    subtotal: number;
    iva: number;
    total: number;

    observaciones?: string | null;

    createdAt: Date | string;
    updatedAt: Date | string;
    updatedByUuid?: string | null;
    deletedAt?: Date | string | null;
}


export interface OrdenProducto {
    id: number;
    uuid: string;

    ordenUuid: string;
    productoUuid: string;

    cantidad: number;
    precioUnitario: number;

    descuento: number;
    subtotal: number;
    iva: number;
    total: number;
    estadoSync: 'PENDIENTE' | 'SINCRONIZADO' | string;

    notas?: string | null;
    createdAt: Date | string;
    updatedAt: Date | string;
    updatedByUuid?: string | null;
    deletedAt?: Date | null | string;
}


export interface Factura {
    id: number;
    uuid: string;

    numeroFactura: string;
    claveAcceso: string;

    clienteUuid: string;
    ordenUuid?: string;

    fechaEmision: Date;

    subtotal0: number;
    subtotalIva: number;
    subtotal: number;

    descuento: number;
    iva: number;
    total: number;

    estadoSri: 'PENDIENTE' | 'AUTORIZADA' | 'RECHAZADA';
    estadoSync: 'PENDIENTE' | 'SINCRONIZADO';

    pdfUrl?: string;

    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}


export interface Pago {
    id: number;
    uuid: string;

    ordenUuid?: string;
    facturaUuid?: string;

    tipoPagoUuid: string;

    monto: number;
    referencia?: string;

    estado: 'PENDIENTE' | 'COMPLETADO' | 'ANULADO';
    estadoSync: 'PENDIENTE' | 'SINCRONIZADO';

    fechaPago: Date;
    createdAt: Date;
    updatedAt: Date;
    updatedByUuid?: string;
    deletedAt?: Date;
}

export interface TipoPago {
    id: number;
    uuid: string;
    nombre: string;
    activo: boolean;
    createdAt: Date;
    updatedAt: Date;
    updatedByUuid?: string;
    deletedAt?: Date;
}



export interface Plan {
    id: number;
    uuid: string;
    nombre: string;

    activo: boolean;
    perfilNegocioUuid?: string;
    updatedAt: Date;
    deletedAt?: Date;
}


export interface Feature {
    id: number;

    uuid: string;
    nombre: string;

    habilitado: boolean;
    perfilNegocioUuid?: string;
    updatedAt: Date;
    deletedAt?: Date;
}
