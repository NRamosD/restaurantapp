export interface Factura {
    id_factura?: number;           // autoincremental, opcional al crear
    id_orden: number;              // FK a Ordenes
    uuid: string;                  // único
    valor_subtotal: number;
    valor_iva?: number | null;     // puede ser NULL
    valor_total: number;
    fecha_creacion?: string;       // DATETIME, default CURRENT_TIMESTAMP
    fecha_emision?: string | null; 
    estado?: "pagada" | "pendiente" | "anulada"; // default 'pendiente'
}