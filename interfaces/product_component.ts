export interface ProductoComponente {
  producto_uuid: string;
  componente_uuid: string;
  negocio_uuid: string;
  uuid: string;              // UNIQUE
  cantidad?: number;         // default 1
}