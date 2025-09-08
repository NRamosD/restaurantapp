export interface ItemOrderExtended {
    order_uui:string;
    order_id:number;
    order_number:number;
    details: string;
    time:string;//"12:28",
    date:string;//"2025-6-23"
}

export interface Orden {
    id_orden?: number;       // autoincrement, opcional al crear
    id_perfil: number;       // FK a Perfil
    uuid:string;
    fecha?: string;          // DATETIME, default CURRENT_TIMESTAMP
    estado?: "pendiente" | "pagado" | "cancelado";  // default "pendiente"
    total: number;
}
  