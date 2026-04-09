export interface ItemOrderExtended {
    order_uuid:string;
    order_number:number;
    details: string;
    time:string;//"12:28",
    date:string;//"2025-6-23"
}

export interface Orden {
    uuid?:string;
    perfilNegocioUuid?: string;
    negocioUuid?: string;
    nota?:string;
    fecha?: string;          // DATETIME, default CURRENT_TIMESTAMP
    estado?: "pendiente" | "pagado" | "cancelado";  // default "pendiente"
    total: number;
}


const OrdenStatus = {
    PENDIENTE: "pendiente",
    PAGADO: "pagado",
    CANCELADO: "cancelado",
    RESERVADO: "reservado"
}