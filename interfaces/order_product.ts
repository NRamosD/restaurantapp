export interface OrdenProducto {
    orden_uuid: string;        // FK a Ordenes
    producto_uuid: string;     // FK a Producto
    negocio_uuid?: string|null;
    uuid: string;
    cantidad: number;
    precio_unitario: number;
    subtotal?: number;
    detalle?: string; // opcional
}