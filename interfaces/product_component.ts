export interface ProductoComponente {
  id_producto: number;       // FK a Producto
  id_componente: number;     // FK a Componente
  uuid: string;              // UNIQUE
  cantidad?: number;         // default 1
}