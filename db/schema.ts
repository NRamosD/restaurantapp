import { sqliteTable, text, integer, real, primaryKey } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

export const PerfilNegocio = sqliteTable('PerfilNegocio', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  uuid: text('uuid').notNull().unique(),
  nombreComercial: text('nombre_comercial').notNull(),
  razonSocial: text('razon_social').notNull(),
  ruc: text('ruc').notNull(),
  direccion: text('direccion').notNull(),
  telefono: text('telefono'),
  email: text('email'),
  obligadoContabilidad: integer('obligado_contabilidad').notNull().default(0),
  regimenRimpe: integer('regimen_rimpe'),
  ambiente: text('ambiente').notNull().default('PRUEBAS'),
  tipoEmision: text('tipo_emision').notNull().default('NORMAL'),
  secuenciaFacturaActual: integer('secuencia_factura_actual').notNull().default(0),
  secuenciaOrdenActual: integer('secuencia_orden_actual').notNull().default(0),
  createdAt: text('created_at').notNull().default(new Date().toISOString()),
  updatedAt: text('updated_at').notNull().default(new Date().toISOString()),
  deletedAt: text('deleted_at'),
});

export const CategoriaProducto = sqliteTable('CategoriaProducto', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  uuid: text('uuid').notNull().unique(),
  nombre: text('nombre').notNull(),
  slug: text('slug').notNull().unique(),
  activo: integer('activo').notNull().default(1),
  createdAt: text('created_at').notNull().default(new Date().toISOString()),
  updatedAt: text('updated_at').notNull().default(new Date().toISOString()),
  deletedAt: text('deleted_at'),
});

export const VariacionesProducto = sqliteTable('VariacionesProducto', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  uuid: text('uuid').notNull().unique(),
  nombre: text('nombre').notNull(),
  descripcion: text('descripcion'),
  createdAt: text('created_at').notNull().default(new Date().toISOString()),
  updatedAt: text('updated_at').notNull().default(new Date().toISOString()),
  deletedAt: text('deleted_at'),
});

export const Usuario = sqliteTable('Usuario', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  uuid: text('uuid').notNull().unique(),
  nombre: text('nombre').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  rol: text('rol').notNull(),
  perfilNegocioUuid: text('perfil_negocio_uuid').notNull(),
  activo: integer('activo').notNull().default(1),
  createdAt: text('created_at').notNull().default(new Date().toISOString()),
  deletedAt: text('deleted_at'),
});

export const Sesion = sqliteTable('Sesion', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  uuid: text('uuid').notNull().unique(),
  usuarioUuid: text('usuario_uuid').notNull(),
  token: text('token').notNull(),
  expiraEn: text('expira_en').notNull(),
  ultimoLogin: text('ultimo_login').notNull().default(new Date().toISOString()),
  activo: integer('activo').notNull().default(1),
  estadoSync: text('estado_sync').notNull().default('PENDIENTE'),
  deletedAt: text('deleted_at'),
});

export const Permiso = sqliteTable('Permiso', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  uuid: text('uuid').notNull().unique(),
  nombre: text('nombre').notNull().unique(),
  descripcion: text('descripcion'),
  createdAt: text('created_at').notNull().default(new Date().toISOString()),
  updatedAt: text('updated_at').notNull().default(new Date().toISOString()),
  updatedByUuid: text('updated_by_uuid'),
  deletedAt: text('deleted_at'),
});

export const UsuarioPermiso = sqliteTable('UsuarioPermiso', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  uuid: text('uuid').notNull().unique(),
  usuarioUuid: text('usuario_uuid').notNull(),
  permisoUuid: text('permiso_uuid').notNull(),
  deletedAt: text('deleted_at'),
});

export const Cliente = sqliteTable('Cliente', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  uuid: text('uuid').notNull().unique(),
  nombre: text('nombre').notNull(),
  tipoIdentificacion: text('tipo_identificacion').notNull(),
  identificacion: text('identificacion').notNull(),
  direccion: text('direccion'),
  telefono: text('telefono'),
  email: text('email'),
  estadoSync: text('estado_sync').notNull().default('PENDIENTE'),
  createdAt: text('created_at').notNull().default(new Date().toISOString()),
  updatedAt: text('updated_at').notNull().default(new Date().toISOString()),
  deletedAt: text('deleted_at'),
});

export const Producto = sqliteTable('Producto', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  uuid: text('uuid').notNull().unique(),
  nombre: text('nombre').notNull(),
  descripcion: text('descripcion'),
  precio: integer('precio').notNull(),
  aplicaIva: integer('aplica_iva').notNull().default(1),
  porcentajeIva: real('porcentaje_iva').notNull().default(12.0),
  stock: integer('stock').notNull().default(0),
  ilimitado: integer('ilimitado').notNull().default(0),
  imagenUrl: text('imagen_url'),
  galeria: text('galeria'),
  estado: text('estado').notNull().default('DISPONIBLE'),
  categoriaProductoUuid: text('categoria_producto_uuid'),
  variacionesProductoUuid: text('variaciones_producto_uuid'),
  perfilNegocioUuid: text('perfil_negocio_uuid').notNull(),
  estadoSync: text('estado_sync').notNull().default('PENDIENTE'),
  createdAt: text('created_at').notNull().default(new Date().toISOString()),
  updatedAt: text('updated_at'),
  updatedByUuid: text('updated_by_uuid'),
  deletedAt: text('deleted_at'),
});

export const Componente = sqliteTable('Componente', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  uuid: text('uuid').notNull().unique(),
  nombre: text('nombre').notNull(),
  unidadMedida: text('unidad_medida').notNull(),
  stockActual: real('stock_actual').notNull().default(0),
  stockMinimo: real('stock_minimo').notNull().default(0),
  costoUnitario: integer('costo_unitario').notNull().default(0),
  perfilNegocioUuid: text('perfil_negocio_uuid').notNull(),
  createdAt: text('created_at').notNull().default(new Date().toISOString()),
  deletedAt: text('deleted_at'),
});

export const ProductoComponente = sqliteTable('ProductoComponente', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  uuid: text('uuid').notNull().unique(),
  productoUuid: text('producto_uuid').notNull(),
  componenteUuid: text('componente_uuid').notNull(),
  cantidad: real('cantidad').notNull().default(1),
  estadoSync: text('estado_sync').default('PENDIENTE'),
  createdAt: text('created_at').notNull().default(new Date().toISOString()),
  updatedAt: text('updated_at').notNull().default(new Date().toISOString()),
  updatedByUuid: text('updated_by_uuid'),
  deletedAt: text('deleted_at'),
});

export const ProductoOpciones = sqliteTable('ProductoOpciones', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  uuid: text('uuid').notNull().unique(),
  productoUuid: text('producto_uuid').notNull(),
  nombre: text('nombre').notNull(),
  descripcion: text('descripcion'),
  valorAdicional: integer('valor_adicional').notNull().default(0),
  orden: integer('orden').notNull().default(0),
  activo: integer('activo').notNull().default(1),
  estadoSync: text('estado_sync').notNull().default('PENDIENTE'),
  createdAt: text('created_at').notNull().default(new Date().toISOString()),
  updatedAt: text('updated_at').notNull().default(new Date().toISOString()),
  updatedByUuid: text('updated_by_uuid'),
  deletedAt: text('deleted_at'),
});

export const Orden = sqliteTable('Orden', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  uuid: text('uuid').notNull().unique(),
  numeroOrden: integer('numero_orden'),
  clienteUuid: text('cliente_uuid'),
  usuarioUuid: text('usuario_uuid').notNull(),
  tipo: text('tipo').notNull(),
  estado: text('estado').notNull().default('PENDIENTE'),
  estadoSync: text('estado_sync').notNull().default('PENDIENTE'),
  subtotal: integer('subtotal').notNull().default(0),
  iva: integer('iva').notNull().default(0),
  total: integer('total').notNull().default(0),
  observaciones: text('observaciones'),
  createdAt: text('created_at').notNull().default(new Date().toISOString()),
  updatedAt: text('updated_at').notNull().default(new Date().toISOString()),
  updatedByUuid: text('updated_by_uuid'),
  deletedAt: text('deleted_at'),
});

export const OrdenProducto = sqliteTable('OrdenProducto', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  uuid: text('uuid').notNull().unique(),
  ordenUuid: text('orden_uuid').notNull(),
  productoUuid: text('producto_uuid').notNull(),
  cantidad: integer('cantidad').notNull().default(1),
  precioUnitario: integer('precio_unitario').notNull().default(0),
  descuento: integer('descuento').notNull().default(0),
  subtotal: integer('subtotal').notNull().default(0),
  iva: integer('iva').notNull().default(0),
  total: integer('total').notNull().default(0),
  estadoSync: text('estado_sync').notNull().default('PENDIENTE'),
  notas: text('notas'),
  createdAt: text('created_at').notNull().default(new Date().toISOString()),
  updatedAt: text('updated_at').notNull().default(new Date().toISOString()),
  updatedByUuid: text('updated_by_uuid'),
  deletedAt: text('deleted_at'),
});

export const Factura = sqliteTable('Factura', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  uuid: text('uuid').notNull().unique(),
  numeroFactura: text('numero_factura').notNull().unique(),
  claveAcceso: text('clave_acceso').notNull(),
  clienteUuid: text('cliente_uuid').notNull(),
  ordenUuid: text('orden_uuid'),
  fechaEmision: text('fecha_emision').notNull(),
  subtotal0: integer('subtotal_0').notNull().default(0),
  subtotalIva: integer('subtotal_iva').notNull().default(0),
  subtotal: integer('subtotal').notNull().default(0),
  descuento: integer('descuento').notNull().default(0),
  iva: integer('iva').notNull().default(0),
  total: integer('total').notNull().default(0),
  estadoSri: text('estado_sri').notNull().default('PENDIENTE'),
  estadoSync: text('estado_sync').notNull().default('PENDIENTE'),
  pdfUrl: text('pdf_url'),
  createdAt: text('created_at').notNull().default(new Date().toISOString()),
  updatedAt: text('updated_at').notNull().default(new Date().toISOString()),
  deletedAt: text('deleted_at'),
});

export const TipoPago = sqliteTable('TipoPago', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  uuid: text('uuid').notNull().unique(),
  nombre: text('nombre').notNull(),
  activo: integer('activo').notNull().default(1),
  createdAt: text('created_at').notNull().default(new Date().toISOString()),
  updatedAt: text('updated_at').notNull().default(new Date().toISOString()),
  updatedByUuid: text('updated_by_uuid'),
  deletedAt: text('deleted_at'),
});

export const Pago = sqliteTable('Pago', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  uuid: text('uuid').notNull().unique(),
  ordenUuid: text('orden_uuid'),
  facturaUuid: text('factura_uuid'),
  tipoPagoUuid: text('tipo_pago_uuid').notNull(),
  monto: integer('monto').notNull().default(0),
  referencia: text('referencia'),
  estado: text('estado').notNull().default('PENDIENTE'),
  estadoSync: text('estado_sync').notNull().default('PENDIENTE'),
  fechaPago: text('fecha_pago').notNull().default(new Date().toISOString()),
  createdAt: text('created_at').notNull().default(new Date().toISOString()),
  updatedAt: text('updated_at').notNull().default(new Date().toISOString()),
  updatedByUuid: text('updated_by_uuid'),
  deletedAt: text('deleted_at'),
});

export const Plan = sqliteTable('Plan', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  uuid: text('uuid').notNull().unique(),
  nombre: text('nombre').notNull(),
  activo: integer('activo').notNull().default(1),
  perfilNegocioUuid: text('perfil_negocio_uuid'),
  updatedAt: text('updated_at').notNull().default(new Date().toISOString()),
  deletedAt: text('deleted_at'),
});

export const Feature = sqliteTable('Feature', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  uuid: text('uuid').notNull().unique(),
  nombre: text('nombre').notNull(),
  habilitado: integer('habilitado').notNull().default(1),
  perfilNegocioUuid: text('perfil_negocio_uuid'),
  updatedAt: text('updated_at').notNull().default(new Date().toISOString()),
  deletedAt: text('deleted_at'),
});

export const AppConfig = sqliteTable('app_config', {
  clave: text('clave').primaryKey(),
  valor: text('valor'),
});

export const PerfilNegocioRelations = relations(PerfilNegocio, ({ many }) => ({
  usuarios: many(Usuario),
  productos: many(Producto),
  componentes: many(Componente),
  planes: many(Plan),
  features: many(Feature),
}));

export const UsuarioRelations = relations(Usuario, ({ one, many }) => ({
  perfilNegocio: one(PerfilNegocio, {
    fields: [Usuario.perfilNegocioUuid],
    references: [PerfilNegocio.uuid],
  }),
  sesiones: many(Sesion),
  usuarioPermisos: many(UsuarioPermiso),
  ordenes: many(Orden),
}));

export const SesionRelations = relations(Sesion, ({ one }) => ({
  usuario: one(Usuario, {
    fields: [Sesion.usuarioUuid],
    references: [Usuario.uuid],
  }),
}));

export const ClienteRelations = relations(Cliente, ({ many }) => ({
  ordenes: many(Orden),
  facturas: many(Factura),
}));

export const CategoriaProductoRelations = relations(CategoriaProducto, ({ many }) => ({
  productos: many(Producto),
}));
export const VariacionesProductoRelations = relations(VariacionesProducto, ({ many }) => ({
  productos: many(Producto),
}));

export const ProductoOpcionesRelations = relations(ProductoOpciones, ({ one }) => ({
  producto: one(Producto, {
    fields: [ProductoOpciones.productoUuid],
    references: [Producto.uuid],
  }),
}));

export const ProductoRelations = relations(Producto, ({ one, many }) => ({
  perfilNegocio: one(PerfilNegocio, {
    fields: [Producto.perfilNegocioUuid],
    references: [PerfilNegocio.uuid],
  }),
  categoriaProducto: one(CategoriaProducto, {
    fields: [Producto.categoriaProductoUuid],
    references: [CategoriaProducto.uuid],
  }),
  variacionesProducto: one(VariacionesProducto, {
    fields: [Producto.variacionesProductoUuid],
    references: [VariacionesProducto.uuid],
  }),
  productoComponentes: many(ProductoComponente),
  productoOpciones: many(ProductoOpciones),
  ordenProductos: many(OrdenProducto),
}));

export const ComponenteRelations = relations(Componente, ({ one, many }) => ({
  perfilNegocio: one(PerfilNegocio, {
    fields: [Componente.perfilNegocioUuid],
    references: [PerfilNegocio.uuid],
  }),
  productoComponentes: many(ProductoComponente),
}));

export const ProductoComponenteRelations = relations(ProductoComponente, ({ one }) => ({
  producto: one(Producto, {
    fields: [ProductoComponente.productoUuid],
    references: [Producto.uuid],
  }),
  componente: one(Componente, {
    fields: [ProductoComponente.componenteUuid],
    references: [Componente.uuid],
  }),
}));

export const OrdenRelations = relations(Orden, ({ one, many }) => ({
  cliente: one(Cliente, {
    fields: [Orden.clienteUuid],
    references: [Cliente.uuid],
  }),
  usuario: one(Usuario, {
    fields: [Orden.usuarioUuid],
    references: [Usuario.uuid],
  }),
  ordenProductos: many(OrdenProducto),
  facturas: many(Factura),
  pagos: many(Pago),
}));

export const OrdenProductoRelations = relations(OrdenProducto, ({ one }) => ({
  orden: one(Orden, {
    fields: [OrdenProducto.ordenUuid],
    references: [Orden.uuid],
  }),
  producto: one(Producto, {
    fields: [OrdenProducto.productoUuid],
    references: [Producto.uuid],
  }),
}));

export const FacturaRelations = relations(Factura, ({ one, many }) => ({
  cliente: one(Cliente, {
    fields: [Factura.clienteUuid],
    references: [Cliente.uuid],
  }),
  orden: one(Orden, {
    fields: [Factura.ordenUuid],
    references: [Orden.uuid],
  }),
  pagos: many(Pago),
}));

export const TipoPagoRelations = relations(TipoPago, ({ many }) => ({
  pagos: many(Pago),
}));

export const PagoRelations = relations(Pago, ({ one }) => ({
  orden: one(Orden, {
    fields: [Pago.ordenUuid],
    references: [Orden.uuid],
  }),
  factura: one(Factura, {
    fields: [Pago.facturaUuid],
    references: [Factura.uuid],
  }),
  tipoPago: one(TipoPago, {
    fields: [Pago.tipoPagoUuid],
    references: [TipoPago.uuid],
  }),
}));

export const PlanRelations = relations(Plan, ({ one }) => ({
  perfilNegocio: one(PerfilNegocio, {
    fields: [Plan.perfilNegocioUuid],
    references: [PerfilNegocio.uuid],
  }),
}));

export const FeatureRelations = relations(Feature, ({ one }) => ({
  perfilNegocio: one(PerfilNegocio, {
    fields: [Feature.perfilNegocioUuid],
    references: [PerfilNegocio.uuid],
  }),
}));
