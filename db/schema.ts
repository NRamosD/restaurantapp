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

export const Usuario = sqliteTable('Usuario', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  uuid: text('uuid').notNull().unique(),
  nombre: text('nombre').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  rol: text('rol').notNull(),
  perfilNegocioId: integer('perfil_negocio_id').notNull(),
  activo: integer('activo').notNull().default(1),
  createdAt: text('created_at').notNull().default(new Date().toISOString()),
  deletedAt: text('deleted_at'),
});

export const Sesion = sqliteTable('Sesion', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  uuid: text('uuid').notNull().unique(),
  usuarioId: integer('usuario_id').notNull(),
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
  updatedBy: integer('updated_by'),
  deletedAt: text('deleted_at'),
});

export const UsuarioPermiso = sqliteTable('UsuarioPermiso', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  uuid: text('uuid').notNull().unique(),
  usuarioId: integer('usuario_id').notNull(),
  permisoId: integer('permiso_id').notNull(),
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
  perfilNegocioId: integer('perfil_negocio_id').notNull(),
  estadoSync: text('estado_sync').notNull().default('PENDIENTE'),
  createdAt: text('created_at').notNull().default(new Date().toISOString()),
  updatedAt: text('updated_at'),
  updatedBy: integer('updated_by'),
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
  perfilNegocioId: integer('perfil_negocio_id').notNull(),
  createdAt: text('created_at').notNull().default(new Date().toISOString()),
  deletedAt: text('deleted_at'),
});

export const ProductoComponente = sqliteTable('ProductoComponente', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  uuid: text('uuid').notNull().unique(),
  productoId: integer('producto_id').notNull(),
  componenteId: integer('componente_id').notNull(),
  cantidad: real('cantidad').notNull().default(1),
  estadoSync: text('estado_sync').default('PENDIENTE'),
  createdAt: text('created_at').notNull().default(new Date().toISOString()),
  updatedAt: text('updated_at').notNull().default(new Date().toISOString()),
  updatedBy: integer('updated_by'),
  deletedAt: text('deleted_at'),
});

export const Orden = sqliteTable('Orden', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  uuid: text('uuid').notNull().unique(),
  numeroOrden: integer('numero_orden'),
  clienteId: integer('cliente_id'),
  usuarioId: integer('usuario_id').notNull(),
  tipo: text('tipo').notNull(),
  estado: text('estado').notNull().default('PENDIENTE'),
  estadoSync: text('estado_sync').notNull().default('PENDIENTE'),
  subtotal: integer('subtotal').notNull().default(0),
  iva: integer('iva').notNull().default(0),
  total: integer('total').notNull().default(0),
  observaciones: text('observaciones'),
  createdAt: text('created_at').notNull().default(new Date().toISOString()),
  updatedAt: text('updated_at').notNull().default(new Date().toISOString()),
  updatedBy: integer('updated_by'),
  deletedAt: text('deleted_at'),
});

export const OrdenProducto = sqliteTable('OrdenProducto', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  uuid: text('uuid').notNull().unique(),
  ordenId: integer('orden_id').notNull(),
  productoId: integer('producto_id').notNull(),
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
  updatedBy: integer('updated_by'),
  deletedAt: text('deleted_at'),
});

export const Factura = sqliteTable('Factura', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  uuid: text('uuid').notNull().unique(),
  numeroFactura: text('numero_factura').notNull().unique(),
  claveAcceso: text('clave_acceso').notNull(),
  clienteId: integer('cliente_id').notNull(),
  ordenId: integer('orden_id'),
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
  updatedBy: integer('updated_by'),
  deletedAt: text('deleted_at'),
});

export const Pago = sqliteTable('Pago', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  uuid: text('uuid').notNull().unique(),
  ordenId: integer('orden_id'),
  facturaId: integer('factura_id'),
  tipoPagoId: integer('tipo_pago_id').notNull(),
  monto: integer('monto').notNull().default(0),
  referencia: text('referencia'),
  estado: text('estado').notNull().default('PENDIENTE'),
  estadoSync: text('estado_sync').notNull().default('PENDIENTE'),
  fechaPago: text('fecha_pago').notNull().default(new Date().toISOString()),
  createdAt: text('created_at').notNull().default(new Date().toISOString()),
  updatedAt: text('updated_at').notNull().default(new Date().toISOString()),
  updatedBy: integer('updated_by'),
  deletedAt: text('deleted_at'),
});

export const Plan = sqliteTable('Plan', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  uuid: text('uuid').notNull().unique(),
  nombre: text('nombre').notNull(),
  activo: integer('activo').notNull().default(1),
  perfilNegocioId: integer('perfil_negocio_id'),
  updatedAt: text('updated_at').notNull().default(new Date().toISOString()),
  deletedAt: text('deleted_at'),
});

export const Feature = sqliteTable('Feature', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  uuid: text('uuid').notNull().unique(),
  nombre: text('nombre').notNull(),
  habilitado: integer('habilitado').notNull().default(1),
  perfilNegocioId: integer('perfil_negocio_id'),
  updatedAt: text('updated_at').notNull().default(new Date().toISOString()),
  deletedAt: text('deleted_at'),
});

export const AppConfig = sqliteTable('app_config', {
  clave: text('clave').primaryKey(),
  valor: text('valor').notNull(),
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
    fields: [Usuario.perfilNegocioId],
    references: [PerfilNegocio.id],
  }),
  sesiones: many(Sesion),
  usuarioPermisos: many(UsuarioPermiso),
  ordenes: many(Orden),
}));

export const SesionRelations = relations(Sesion, ({ one }) => ({
  usuario: one(Usuario, {
    fields: [Sesion.usuarioId],
    references: [Usuario.id],
  }),
}));

export const ClienteRelations = relations(Cliente, ({ many }) => ({
  ordenes: many(Orden),
  facturas: many(Factura),
}));

export const ProductoRelations = relations(Producto, ({ one, many }) => ({
  perfilNegocio: one(PerfilNegocio, {
    fields: [Producto.perfilNegocioId],
    references: [PerfilNegocio.id],
  }),
  productoComponentes: many(ProductoComponente),
  ordenProductos: many(OrdenProducto),
}));

export const ComponenteRelations = relations(Componente, ({ one, many }) => ({
  perfilNegocio: one(PerfilNegocio, {
    fields: [Componente.perfilNegocioId],
    references: [PerfilNegocio.id],
  }),
  productoComponentes: many(ProductoComponente),
}));

export const ProductoComponenteRelations = relations(ProductoComponente, ({ one }) => ({
  producto: one(Producto, {
    fields: [ProductoComponente.productoId],
    references: [Producto.id],
  }),
  componente: one(Componente, {
    fields: [ProductoComponente.componenteId],
    references: [Componente.id],
  }),
}));

export const OrdenRelations = relations(Orden, ({ one, many }) => ({
  cliente: one(Cliente, {
    fields: [Orden.clienteId],
    references: [Cliente.id],
  }),
  usuario: one(Usuario, {
    fields: [Orden.usuarioId],
    references: [Usuario.id],
  }),
  ordenProductos: many(OrdenProducto),
  facturas: many(Factura),
  pagos: many(Pago),
}));

export const OrdenProductoRelations = relations(OrdenProducto, ({ one }) => ({
  orden: one(Orden, {
    fields: [OrdenProducto.ordenId],
    references: [Orden.id],
  }),
  producto: one(Producto, {
    fields: [OrdenProducto.productoId],
    references: [Producto.id],
  }),
}));

export const FacturaRelations = relations(Factura, ({ one, many }) => ({
  cliente: one(Cliente, {
    fields: [Factura.clienteId],
    references: [Cliente.id],
  }),
  orden: one(Orden, {
    fields: [Factura.ordenId],
    references: [Orden.id],
  }),
  pagos: many(Pago),
}));

export const TipoPagoRelations = relations(TipoPago, ({ many }) => ({
  pagos: many(Pago),
}));

export const PagoRelations = relations(Pago, ({ one }) => ({
  orden: one(Orden, {
    fields: [Pago.ordenId],
    references: [Orden.id],
  }),
  factura: one(Factura, {
    fields: [Pago.facturaId],
    references: [Factura.id],
  }),
  tipoPago: one(TipoPago, {
    fields: [Pago.tipoPagoId],
    references: [TipoPago.id],
  }),
}));

export const PlanRelations = relations(Plan, ({ one }) => ({
  perfilNegocio: one(PerfilNegocio, {
    fields: [Plan.perfilNegocioId],
    references: [PerfilNegocio.id],
  }),
}));

export const FeatureRelations = relations(Feature, ({ one }) => ({
  perfilNegocio: one(PerfilNegocio, {
    fields: [Feature.perfilNegocioId],
    references: [PerfilNegocio.id],
  }),
}));
