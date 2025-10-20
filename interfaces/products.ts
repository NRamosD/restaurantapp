// export interface Products {
//     uuid: string;
//     name:string;
//     details:string;
//     image:string;
//     created:string;//"12:28",
//     modified:string;//"2025-6-23"
// }


export interface Dimensiones {
  ancho: number;
  alto: number;
  largo: number;
}

export interface ProductOld {
  // Identificación
  id?: number | string;
  uuid: string;
  sku?: string;
  codigoBarras?: string;
  slug?: string;

  // Datos básicos
  nombre: string;
  descripcion?: string;
  precio?: number;
  moneda?: string;              // USD, EUR, etc.
  stock?: number;
  unidad?: string;              // unidad, kg, litro, etc.
  activo?: boolean;

  // Organización
  categoria?: string;
  subcategoria?: string;
  tags?: string[];
  marca?: string;

  // Visual / Media
  imagenUrl?: string;
  galeria?: string[];           // Otras imágenes
  videoUrl?: string;

  // Control / Gestión
  destacado?: boolean;
  orden?: number;               // Para orden personalizado
  fechaCreacion: Date|string;
  fechaActualizacion?: Date|string;
  usuarioCreadorId?: number;

  // Comerciales
  ivaIncluido?: boolean;
  ivaPorcentaje?: number;
  descuento?: number;           // En porcentaje
  precioAnterior?: number;
  envioGratis?: boolean;
  tiempoEntrega?: string;       // Ej: "3-5 días"


  // Relaciones
  relacionados?: number[];      // IDs de productos relacionados
}



export interface Product {
  id_producto: number;
  uuid: string;
  id_perfil: number;
  id_negocio: string;
  nombre: string;
  descripcion?: string | null;
  imagen?: string | null;
  iva?: number | null;
  precio: number;
  precio_total: number;
  ilimitado?: boolean;
  stock: number;
  estado: string; // default "disponible"

  // Visual / Media
  imagen_url?: string;
  galeria?: string;           // Otras imágenes
  video_url?: string;
  codigo_barras?: string;
  slug?: string;

  descuento?: number;           // En porcentaje
  precio_anterior?: number;
  envio_gratis?: boolean;
  tiempo_entrega?: string;  

}