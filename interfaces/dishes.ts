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

export interface Dishes {
  // Identificación
  id?: number | string;
  uuid: string;
  nombre: string;
  descripcion?: string;
  precio?: number;
  categoria?: string;
  subcategoria?: string;
  imagenUrl?: string;
  galeria?: string[];           // Otras imágenes
  videoUrl?: string;
  descuento?: number;           // En porcentaje
  precioAnterior?: number;
  envioGratis?: boolean;
  relacionados?: number[];      // IDs de productos relacionados

  fechaCreacion: Date|string;
  fechaActualizacion?: Date|string;
  usuarioCreadorId?: number;
  // sku?: string;
  // codigoBarras?: string;
  // slug?: string;

  // Datos básicos
  // moneda?: string;              // USD, EUR, etc.
  // stock?: number;
  // unidad?: string;              // unidad, kg, litro, etc.
  // activo?: boolean;

  // Organización
  // tags?: string[];
  // marca?: string;

  // Visual / Media

  // Control / Gestión
  // destacado?: boolean;
  // orden?: number;               // Para orden personalizado

  // Comerciales
  // ivaIncluido?: boolean;
  // ivaPorcentaje?: number;
  // tiempoEntrega?: string;       // Ej: "3-5 días"

  // Técnicos
  // atributosAdicionales?: any;
  // esDigital?: boolean;
  // descargable?: boolean;
  // archivoUrl?: string;
  // peso?: number;
  // dimensiones?: Dimensiones;

  // Relaciones
}
