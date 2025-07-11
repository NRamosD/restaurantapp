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

export interface Product {
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

  // Técnicos
  atributosAdicionales?: any;
  esDigital?: boolean;
  descargable?: boolean;
  archivoUrl?: string;
  peso?: number;
  dimensiones?: Dimensiones;

  // Relaciones
  relacionados?: number[];      // IDs de productos relacionados
}
