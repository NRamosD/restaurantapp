export interface Componente {
    id_componente?: number;          // autoincrement, opcional al crear
    uuid: string;                    // UNIQUE
    id_perfil: number;
    nombre: string;
    descripcion?: string | null;
    tipo?: string | null;
    material?: string | null;
    peso?: number | null;
    longitud?: number | null;
    ancho?: number | null;
    alto?: number | null;
    calorias?: number | null;
    stock?: number;                  // default 0
    porciones?: number | null;
    color?: string | null;
    fecha_creacion?: string;         // DATETIME en SQLite como string
}
  