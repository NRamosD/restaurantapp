PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_Componente` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uuid` text NOT NULL,
	`nombre` text NOT NULL,
	`unidad_medida` text NOT NULL,
	`stock_actual` real DEFAULT 0 NOT NULL,
	`stock_minimo` real DEFAULT 0 NOT NULL,
	`costo_unitario` integer DEFAULT 0 NOT NULL,
	`perfil_negocio_uuid` text NOT NULL,
	`created_at` text DEFAULT '2026-04-10T03:23:22.089Z' NOT NULL,
	`deleted_at` text
);
--> statement-breakpoint
INSERT INTO `__new_Componente`("id", "uuid", "nombre", "unidad_medida", "stock_actual", "stock_minimo", "costo_unitario", "perfil_negocio_uuid", "created_at", "deleted_at") SELECT "id", "uuid", "nombre", "unidad_medida", "stock_actual", "stock_minimo", "costo_unitario", "perfil_negocio_uuid", "created_at", "deleted_at" FROM `Componente`;--> statement-breakpoint
DROP TABLE `Componente`;--> statement-breakpoint
ALTER TABLE `__new_Componente` RENAME TO `Componente`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `Componente_uuid_unique` ON `Componente` (`uuid`);--> statement-breakpoint
CREATE TABLE `__new_Factura` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uuid` text NOT NULL,
	`numero_factura` text NOT NULL,
	`clave_acceso` text NOT NULL,
	`cliente_uuid` text NOT NULL,
	`orden_uuid` text,
	`fecha_emision` text NOT NULL,
	`subtotal_0` integer DEFAULT 0 NOT NULL,
	`subtotal_iva` integer DEFAULT 0 NOT NULL,
	`subtotal` integer DEFAULT 0 NOT NULL,
	`descuento` integer DEFAULT 0 NOT NULL,
	`iva` integer DEFAULT 0 NOT NULL,
	`total` integer DEFAULT 0 NOT NULL,
	`estado_sri` text DEFAULT 'PENDIENTE' NOT NULL,
	`estado_sync` text DEFAULT 'PENDIENTE' NOT NULL,
	`pdf_url` text,
	`created_at` text DEFAULT '2026-04-10T03:23:22.089Z' NOT NULL,
	`updated_at` text DEFAULT '2026-04-10T03:23:22.089Z' NOT NULL,
	`deleted_at` text
);
--> statement-breakpoint
INSERT INTO `__new_Factura`("id", "uuid", "numero_factura", "clave_acceso", "cliente_uuid", "orden_uuid", "fecha_emision", "subtotal_0", "subtotal_iva", "subtotal", "descuento", "iva", "total", "estado_sri", "estado_sync", "pdf_url", "created_at", "updated_at", "deleted_at") SELECT "id", "uuid", "numero_factura", "clave_acceso", "cliente_uuid", "orden_uuid", "fecha_emision", "subtotal_0", "subtotal_iva", "subtotal", "descuento", "iva", "total", "estado_sri", "estado_sync", "pdf_url", "created_at", "updated_at", "deleted_at" FROM `Factura`;--> statement-breakpoint
DROP TABLE `Factura`;--> statement-breakpoint
ALTER TABLE `__new_Factura` RENAME TO `Factura`;--> statement-breakpoint
CREATE UNIQUE INDEX `Factura_uuid_unique` ON `Factura` (`uuid`);--> statement-breakpoint
CREATE UNIQUE INDEX `Factura_numero_factura_unique` ON `Factura` (`numero_factura`);--> statement-breakpoint
CREATE TABLE `__new_Feature` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uuid` text NOT NULL,
	`nombre` text NOT NULL,
	`habilitado` integer DEFAULT 1 NOT NULL,
	`perfil_negocio_uuid` text,
	`updated_at` text DEFAULT '2026-04-10T03:23:22.090Z' NOT NULL,
	`deleted_at` text
);
--> statement-breakpoint
INSERT INTO `__new_Feature`("id", "uuid", "nombre", "habilitado", "perfil_negocio_uuid", "updated_at", "deleted_at") SELECT "id", "uuid", "nombre", "habilitado", "perfil_negocio_uuid", "updated_at", "deleted_at" FROM `Feature`;--> statement-breakpoint
DROP TABLE `Feature`;--> statement-breakpoint
ALTER TABLE `__new_Feature` RENAME TO `Feature`;--> statement-breakpoint
CREATE UNIQUE INDEX `Feature_uuid_unique` ON `Feature` (`uuid`);--> statement-breakpoint
CREATE TABLE `__new_Orden` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uuid` text NOT NULL,
	`numero_orden` integer,
	`cliente_uuid` text,
	`usuario_uuid` text NOT NULL,
	`tipo` text NOT NULL,
	`estado` text DEFAULT 'PENDIENTE' NOT NULL,
	`estado_sync` text DEFAULT 'PENDIENTE' NOT NULL,
	`subtotal` integer DEFAULT 0 NOT NULL,
	`iva` integer DEFAULT 0 NOT NULL,
	`total` integer DEFAULT 0 NOT NULL,
	`observaciones` text,
	`created_at` text DEFAULT '2026-04-10T03:23:22.089Z' NOT NULL,
	`updated_at` text DEFAULT '2026-04-10T03:23:22.089Z' NOT NULL,
	`updated_by_uuid` text,
	`deleted_at` text
);
--> statement-breakpoint
INSERT INTO `__new_Orden`("id", "uuid", "numero_orden", "cliente_uuid", "usuario_uuid", "tipo", "estado", "estado_sync", "subtotal", "iva", "total", "observaciones", "created_at", "updated_at", "updated_by_uuid", "deleted_at") SELECT "id", "uuid", "numero_orden", "cliente_uuid", "usuario_uuid", "tipo", "estado", "estado_sync", "subtotal", "iva", "total", "observaciones", "created_at", "updated_at", "updated_by_uuid", "deleted_at" FROM `Orden`;--> statement-breakpoint
DROP TABLE `Orden`;--> statement-breakpoint
ALTER TABLE `__new_Orden` RENAME TO `Orden`;--> statement-breakpoint
CREATE UNIQUE INDEX `Orden_uuid_unique` ON `Orden` (`uuid`);--> statement-breakpoint
CREATE TABLE `__new_OrdenProducto` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uuid` text NOT NULL,
	`orden_uuid` text NOT NULL,
	`producto_uuid` text NOT NULL,
	`cantidad` integer DEFAULT 1 NOT NULL,
	`precio_unitario` integer DEFAULT 0 NOT NULL,
	`descuento` integer DEFAULT 0 NOT NULL,
	`subtotal` integer DEFAULT 0 NOT NULL,
	`iva` integer DEFAULT 0 NOT NULL,
	`total` integer DEFAULT 0 NOT NULL,
	`estado_sync` text DEFAULT 'PENDIENTE' NOT NULL,
	`notas` text,
	`created_at` text DEFAULT '2026-04-10T03:23:22.089Z' NOT NULL,
	`updated_at` text DEFAULT '2026-04-10T03:23:22.089Z' NOT NULL,
	`updated_by_uuid` text,
	`deleted_at` text
);
--> statement-breakpoint
INSERT INTO `__new_OrdenProducto`("id", "uuid", "orden_uuid", "producto_uuid", "cantidad", "precio_unitario", "descuento", "subtotal", "iva", "total", "estado_sync", "notas", "created_at", "updated_at", "updated_by_uuid", "deleted_at") SELECT "id", "uuid", "orden_uuid", "producto_uuid", "cantidad", "precio_unitario", "descuento", "subtotal", "iva", "total", "estado_sync", "notas", "created_at", "updated_at", "updated_by_uuid", "deleted_at" FROM `OrdenProducto`;--> statement-breakpoint
DROP TABLE `OrdenProducto`;--> statement-breakpoint
ALTER TABLE `__new_OrdenProducto` RENAME TO `OrdenProducto`;--> statement-breakpoint
CREATE UNIQUE INDEX `OrdenProducto_uuid_unique` ON `OrdenProducto` (`uuid`);--> statement-breakpoint
CREATE TABLE `__new_Pago` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uuid` text NOT NULL,
	`orden_uuid` text,
	`factura_uuid` text,
	`tipo_pago_uuid` text NOT NULL,
	`monto` integer DEFAULT 0 NOT NULL,
	`referencia` text,
	`estado` text DEFAULT 'PENDIENTE' NOT NULL,
	`estado_sync` text DEFAULT 'PENDIENTE' NOT NULL,
	`fecha_pago` text DEFAULT '2026-04-10T03:23:22.090Z' NOT NULL,
	`created_at` text DEFAULT '2026-04-10T03:23:22.090Z' NOT NULL,
	`updated_at` text DEFAULT '2026-04-10T03:23:22.090Z' NOT NULL,
	`updated_by_uuid` text,
	`deleted_at` text
);
--> statement-breakpoint
INSERT INTO `__new_Pago`("id", "uuid", "orden_uuid", "factura_uuid", "tipo_pago_uuid", "monto", "referencia", "estado", "estado_sync", "fecha_pago", "created_at", "updated_at", "updated_by_uuid", "deleted_at") SELECT "id", "uuid", "orden_uuid", "factura_uuid", "tipo_pago_uuid", "monto", "referencia", "estado", "estado_sync", "fecha_pago", "created_at", "updated_at", "updated_by_uuid", "deleted_at" FROM `Pago`;--> statement-breakpoint
DROP TABLE `Pago`;--> statement-breakpoint
ALTER TABLE `__new_Pago` RENAME TO `Pago`;--> statement-breakpoint
CREATE UNIQUE INDEX `Pago_uuid_unique` ON `Pago` (`uuid`);--> statement-breakpoint
CREATE TABLE `__new_Permiso` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uuid` text NOT NULL,
	`nombre` text NOT NULL,
	`descripcion` text,
	`created_at` text DEFAULT '2026-04-10T03:23:22.089Z' NOT NULL,
	`updated_at` text DEFAULT '2026-04-10T03:23:22.089Z' NOT NULL,
	`updated_by_uuid` text,
	`deleted_at` text
);
--> statement-breakpoint
INSERT INTO `__new_Permiso`("id", "uuid", "nombre", "descripcion", "created_at", "updated_at", "updated_by_uuid", "deleted_at") SELECT "id", "uuid", "nombre", "descripcion", "created_at", "updated_at", "updated_by_uuid", "deleted_at" FROM `Permiso`;--> statement-breakpoint
DROP TABLE `Permiso`;--> statement-breakpoint
ALTER TABLE `__new_Permiso` RENAME TO `Permiso`;--> statement-breakpoint
CREATE UNIQUE INDEX `Permiso_uuid_unique` ON `Permiso` (`uuid`);--> statement-breakpoint
CREATE UNIQUE INDEX `Permiso_nombre_unique` ON `Permiso` (`nombre`);--> statement-breakpoint
CREATE TABLE `__new_Plan` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uuid` text NOT NULL,
	`nombre` text NOT NULL,
	`activo` integer DEFAULT 1 NOT NULL,
	`perfil_negocio_uuid` text,
	`updated_at` text DEFAULT '2026-04-10T03:23:22.090Z' NOT NULL,
	`deleted_at` text
);
--> statement-breakpoint
INSERT INTO `__new_Plan`("id", "uuid", "nombre", "activo", "perfil_negocio_uuid", "updated_at", "deleted_at") SELECT "id", "uuid", "nombre", "activo", "perfil_negocio_uuid", "updated_at", "deleted_at" FROM `Plan`;--> statement-breakpoint
DROP TABLE `Plan`;--> statement-breakpoint
ALTER TABLE `__new_Plan` RENAME TO `Plan`;--> statement-breakpoint
CREATE UNIQUE INDEX `Plan_uuid_unique` ON `Plan` (`uuid`);--> statement-breakpoint
CREATE TABLE `__new_Producto` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uuid` text NOT NULL,
	`nombre` text NOT NULL,
	`descripcion` text,
	`precio` integer NOT NULL,
	`aplica_iva` integer DEFAULT 1 NOT NULL,
	`porcentaje_iva` real DEFAULT 12 NOT NULL,
	`stock` integer DEFAULT 0 NOT NULL,
	`ilimitado` integer DEFAULT 0 NOT NULL,
	`imagen_url` text,
	`galeria` text,
	`estado` text DEFAULT 'DISPONIBLE' NOT NULL,
	`perfil_negocio_uuid` text NOT NULL,
	`estado_sync` text DEFAULT 'PENDIENTE' NOT NULL,
	`created_at` text DEFAULT '2026-04-10T03:23:22.089Z' NOT NULL,
	`updated_at` text,
	`updated_by_uuid` text,
	`deleted_at` text
);
--> statement-breakpoint
INSERT INTO `__new_Producto`("id", "uuid", "nombre", "descripcion", "precio", "aplica_iva", "porcentaje_iva", "stock", "ilimitado", "imagen_url", "galeria", "estado", "perfil_negocio_uuid", "estado_sync", "created_at", "updated_at", "updated_by_uuid", "deleted_at") SELECT "id", "uuid", "nombre", "descripcion", "precio", "aplica_iva", "porcentaje_iva", "stock", "ilimitado", "imagen_url", "galeria", "estado", "perfil_negocio_uuid", "estado_sync", "created_at", "updated_at", "updated_by_uuid", "deleted_at" FROM `Producto`;--> statement-breakpoint
DROP TABLE `Producto`;--> statement-breakpoint
ALTER TABLE `__new_Producto` RENAME TO `Producto`;--> statement-breakpoint
CREATE UNIQUE INDEX `Producto_uuid_unique` ON `Producto` (`uuid`);--> statement-breakpoint
CREATE TABLE `__new_ProductoComponente` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uuid` text NOT NULL,
	`producto_uuid` text NOT NULL,
	`componente_uuid` text NOT NULL,
	`cantidad` real DEFAULT 1 NOT NULL,
	`estado_sync` text DEFAULT 'PENDIENTE',
	`created_at` text DEFAULT '2026-04-10T03:23:22.089Z' NOT NULL,
	`updated_at` text DEFAULT '2026-04-10T03:23:22.089Z' NOT NULL,
	`updated_by_uuid` text,
	`deleted_at` text
);
--> statement-breakpoint
INSERT INTO `__new_ProductoComponente`("id", "uuid", "producto_uuid", "componente_uuid", "cantidad", "estado_sync", "created_at", "updated_at", "updated_by_uuid", "deleted_at") SELECT "id", "uuid", "producto_uuid", "componente_uuid", "cantidad", "estado_sync", "created_at", "updated_at", "updated_by_uuid", "deleted_at" FROM `ProductoComponente`;--> statement-breakpoint
DROP TABLE `ProductoComponente`;--> statement-breakpoint
ALTER TABLE `__new_ProductoComponente` RENAME TO `ProductoComponente`;--> statement-breakpoint
CREATE UNIQUE INDEX `ProductoComponente_uuid_unique` ON `ProductoComponente` (`uuid`);--> statement-breakpoint
CREATE TABLE `__new_Sesion` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uuid` text NOT NULL,
	`usuario_uuid` text NOT NULL,
	`token` text NOT NULL,
	`expira_en` text NOT NULL,
	`ultimo_login` text DEFAULT '2026-04-10T03:23:22.089Z' NOT NULL,
	`activo` integer DEFAULT 1 NOT NULL,
	`estado_sync` text DEFAULT 'PENDIENTE' NOT NULL,
	`deleted_at` text
);
--> statement-breakpoint
INSERT INTO `__new_Sesion`("id", "uuid", "usuario_uuid", "token", "expira_en", "ultimo_login", "activo", "estado_sync", "deleted_at") SELECT "id", "uuid", "usuario_uuid", "token", "expira_en", "ultimo_login", "activo", "estado_sync", "deleted_at" FROM `Sesion`;--> statement-breakpoint
DROP TABLE `Sesion`;--> statement-breakpoint
ALTER TABLE `__new_Sesion` RENAME TO `Sesion`;--> statement-breakpoint
CREATE UNIQUE INDEX `Sesion_uuid_unique` ON `Sesion` (`uuid`);--> statement-breakpoint
CREATE TABLE `__new_TipoPago` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uuid` text NOT NULL,
	`nombre` text NOT NULL,
	`activo` integer DEFAULT 1 NOT NULL,
	`created_at` text DEFAULT '2026-04-10T03:23:22.089Z' NOT NULL,
	`updated_at` text DEFAULT '2026-04-10T03:23:22.089Z' NOT NULL,
	`updated_by_uuid` text,
	`deleted_at` text
);
--> statement-breakpoint
INSERT INTO `__new_TipoPago`("id", "uuid", "nombre", "activo", "created_at", "updated_at", "updated_by_uuid", "deleted_at") SELECT "id", "uuid", "nombre", "activo", "created_at", "updated_at", "updated_by_uuid", "deleted_at" FROM `TipoPago`;--> statement-breakpoint
DROP TABLE `TipoPago`;--> statement-breakpoint
ALTER TABLE `__new_TipoPago` RENAME TO `TipoPago`;--> statement-breakpoint
CREATE UNIQUE INDEX `TipoPago_uuid_unique` ON `TipoPago` (`uuid`);--> statement-breakpoint
CREATE TABLE `__new_Usuario` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uuid` text NOT NULL,
	`nombre` text NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`rol` text NOT NULL,
	`perfil_negocio_uuid` text NOT NULL,
	`activo` integer DEFAULT 1 NOT NULL,
	`created_at` text DEFAULT '2026-04-10T03:23:22.089Z' NOT NULL,
	`deleted_at` text
);
--> statement-breakpoint
INSERT INTO `__new_Usuario`("id", "uuid", "nombre", "email", "password_hash", "rol", "perfil_negocio_uuid", "activo", "created_at", "deleted_at") SELECT "id", "uuid", "nombre", "email", "password_hash", "rol", "perfil_negocio_uuid", "activo", "created_at", "deleted_at" FROM `Usuario`;--> statement-breakpoint
DROP TABLE `Usuario`;--> statement-breakpoint
ALTER TABLE `__new_Usuario` RENAME TO `Usuario`;--> statement-breakpoint
CREATE UNIQUE INDEX `Usuario_uuid_unique` ON `Usuario` (`uuid`);--> statement-breakpoint
CREATE UNIQUE INDEX `Usuario_email_unique` ON `Usuario` (`email`);--> statement-breakpoint
CREATE TABLE `__new_UsuarioPermiso` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uuid` text NOT NULL,
	`usuario_uuid` text NOT NULL,
	`permiso_uuid` text NOT NULL,
	`deleted_at` text
);
--> statement-breakpoint
INSERT INTO `__new_UsuarioPermiso`("id", "uuid", "usuario_uuid", "permiso_uuid", "deleted_at") SELECT "id", "uuid", "usuario_uuid", "permiso_uuid", "deleted_at" FROM `UsuarioPermiso`;--> statement-breakpoint
DROP TABLE `UsuarioPermiso`;--> statement-breakpoint
ALTER TABLE `__new_UsuarioPermiso` RENAME TO `UsuarioPermiso`;--> statement-breakpoint
CREATE UNIQUE INDEX `UsuarioPermiso_uuid_unique` ON `UsuarioPermiso` (`uuid`);--> statement-breakpoint
CREATE TABLE `__new_Cliente` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uuid` text NOT NULL,
	`nombre` text NOT NULL,
	`tipo_identificacion` text NOT NULL,
	`identificacion` text NOT NULL,
	`direccion` text,
	`telefono` text,
	`email` text,
	`estado_sync` text DEFAULT 'PENDIENTE' NOT NULL,
	`created_at` text DEFAULT '2026-04-10T03:23:22.089Z' NOT NULL,
	`updated_at` text DEFAULT '2026-04-10T03:23:22.089Z' NOT NULL,
	`deleted_at` text
);
--> statement-breakpoint
INSERT INTO `__new_Cliente`("id", "uuid", "nombre", "tipo_identificacion", "identificacion", "direccion", "telefono", "email", "estado_sync", "created_at", "updated_at", "deleted_at") SELECT "id", "uuid", "nombre", "tipo_identificacion", "identificacion", "direccion", "telefono", "email", "estado_sync", "created_at", "updated_at", "deleted_at" FROM `Cliente`;--> statement-breakpoint
DROP TABLE `Cliente`;--> statement-breakpoint
ALTER TABLE `__new_Cliente` RENAME TO `Cliente`;--> statement-breakpoint
CREATE UNIQUE INDEX `Cliente_uuid_unique` ON `Cliente` (`uuid`);--> statement-breakpoint
CREATE TABLE `__new_PerfilNegocio` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uuid` text NOT NULL,
	`nombre_comercial` text NOT NULL,
	`razon_social` text NOT NULL,
	`ruc` text NOT NULL,
	`direccion` text NOT NULL,
	`telefono` text,
	`email` text,
	`obligado_contabilidad` integer DEFAULT 0 NOT NULL,
	`regimen_rimpe` integer,
	`ambiente` text DEFAULT 'PRUEBAS' NOT NULL,
	`tipo_emision` text DEFAULT 'NORMAL' NOT NULL,
	`secuencia_factura_actual` integer DEFAULT 0 NOT NULL,
	`secuencia_orden_actual` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT '2026-04-10T03:23:22.087Z' NOT NULL,
	`updated_at` text DEFAULT '2026-04-10T03:23:22.088Z' NOT NULL,
	`deleted_at` text
);
--> statement-breakpoint
INSERT INTO `__new_PerfilNegocio`("id", "uuid", "nombre_comercial", "razon_social", "ruc", "direccion", "telefono", "email", "obligado_contabilidad", "regimen_rimpe", "ambiente", "tipo_emision", "secuencia_factura_actual", "secuencia_orden_actual", "created_at", "updated_at", "deleted_at") SELECT "id", "uuid", "nombre_comercial", "razon_social", "ruc", "direccion", "telefono", "email", "obligado_contabilidad", "regimen_rimpe", "ambiente", "tipo_emision", "secuencia_factura_actual", "secuencia_orden_actual", "created_at", "updated_at", "deleted_at" FROM `PerfilNegocio`;--> statement-breakpoint
DROP TABLE `PerfilNegocio`;--> statement-breakpoint
ALTER TABLE `__new_PerfilNegocio` RENAME TO `PerfilNegocio`;--> statement-breakpoint
CREATE UNIQUE INDEX `PerfilNegocio_uuid_unique` ON `PerfilNegocio` (`uuid`);