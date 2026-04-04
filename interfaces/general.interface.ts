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

    rol: 'ADMIN' | 'CAJERO' | 'MESERO' | 'COCINA';

    perfilNegocioId: number;

    activo: boolean;
    createdAt: Date;
    deletedAt?: Date;
}

export interface Sesion {
    id: number;
    uuid: string;

    usuarioId: number;

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
    updatedBy?: number;
    deletedAt?: Date;
}

export interface UsuarioPermiso {
    id: number;
    uuid: string;

    usuarioId: number;
    permisoId: number;
    deletedAt?: Date;
}


export interface Cliente {
    id: number;
    uuid: string;
    nombre: string;
    tipoIdentificacion: 'CEDULA' | 'RUC' | 'PASAPORTE' | 'CONSUMIDOR_FINAL';
    identificacion: string;

    direccion?: string;
    telefono?: string;
    email?: string;
    estadoSync: 'PENDIENTE' | 'SINCRONIZADO';

    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}


export interface Producto {
    id: number;
    uuid: string;

    nombre: string;
    descripcion?: string;

    precio: number;
    aplicaIva: boolean;
    porcentajeIva: number;

    stock: number;
    ilimitado: boolean;

    imagenUrl?: string;
    galeria?: string[];

    estado: 'DISPONIBLE' | 'NO_DISPONIBLE';

    perfilNegocioId: number;

    estadoSync: 'PENDIENTE' | 'SINCRONIZADO';

    createdAt: Date;
    updatedAt?: Date;
    updatedBy?: number;
    deletedAt?: Date;
}


export interface Componente {
    id: number;
    uuid: string;
    nombre: string;
    unidadMedida: string;

    stockActual: number;
    stockMinimo: number;

    costoUnitario: number;
    perfilNegocioId: number;

    createdAt: Date;
    deletedAt?: Date;
}

export interface ProductoComponente {
    id: number;
    uuid: string;
    productoId: number;
    componenteId: number;

    cantidad: number;
    estadoSync?: 'PENDIENTE' | 'SINCRONIZADO';
    createdAt: Date;
    updatedAt: Date;
    updatedBy?: number;
    deletedAt?: Date;
}


export interface Orden {
    id: number;
    uuid: string;
    numeroOrden?: number;

    clienteId?: number;
    usuarioId: number;

    tipo: 'LOCAL' | 'LLEVAR' | 'DELIVERY';

    estado: 'PENDIENTE' | 'EN_PREPARACION' | 'LISTO' | 'ENTREGADO' | 'CANCELADO';
    estadoSync: 'PENDIENTE' | 'SINCRONIZADO';

    subtotal: number;
    iva: number;
    total: number;

    observaciones?: string;

    createdAt: Date;
    updatedAt: Date;
    updatedBy?: number;
    deletedAt?: Date;
}


export interface OrdenProducto {
    id: number;
    uuid: string;

    ordenId: number;
    productoId: number;

    cantidad: number;
    precioUnitario: number;

    descuento: number;
    subtotal: number;
    iva: number;
    total: number;
    estadoSync: 'PENDIENTE' | 'SINCRONIZADO';

    notas?: string;
    createdAt: Date;
    updatedAt: Date;
    updatedBy?: number;
    deletedAt?: Date;
}


export interface Factura {
    id: number;
    uuid: string;

    numeroFactura: string;
    claveAcceso: string;

    clienteId: number;
    ordenId?: number;

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

    ordenId?: number;
    facturaId?: number;

    tipoPagoId: number;

    monto: number;
    referencia?: string;

    estado: 'PENDIENTE' | 'COMPLETADO' | 'ANULADO';
    estadoSync: 'PENDIENTE' | 'SINCRONIZADO';

    fechaPago: Date;
    createdAt: Date;
    updatedAt: Date;
    updatedBy?: number;
    deletedAt?: Date;
}

export interface TipoPago {
    id: number;
    uuid: string;
    nombre: string;
    activo: boolean;
    createdAt: Date;
    updatedAt: Date;
    updatedBy?: number;
    deletedAt?: Date;
}



export interface Plan {
    id: number;
    uuid: string;
    nombre: string;

    activo: boolean;
    perfilNegocioId?: number;
    updatedAt: Date;
    deletedAt?: Date;
}


export interface Feature {
    id: number;

    uuid: string;
    nombre: string;

    habilitado: boolean;
    perfilNegocioId?: number;
    updatedAt: Date;
    deletedAt?: Date;
}
