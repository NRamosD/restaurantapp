export interface ProductoComponente {
  id_producto: number;       // FK a Producto
  id_componente: number;     // FK a Componente
  id_negocio: string;
  uuid: string;              // UNIQUE
  cantidad?: number;         // default 1
}