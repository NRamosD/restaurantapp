export interface OrdenProducto {
    id_orden: number;        // FK a Ordenes
    id_producto: number;     // FK a Producto
    uuid: string;
    cantidad: number;
    precio_unitario: number;
    subtotal?: number;
    detalle?: string; // opcional
}
  