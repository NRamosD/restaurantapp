CREATE TABLE `app_config` (
	`clave` text PRIMARY KEY NOT NULL,
	`valor` text
);
--> statement-breakpoint
CREATE TABLE `Cliente` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uuid` text NOT NULL,
	`nombre` text NOT NULL,
	`tipo_identificacion` text NOT NULL,
	`identificacion` text NOT NULL,
	`direccion` text,
	`telefono` text,
	`email` text,
	`estado_sync` text DEFAULT 'PENDIENTE' NOT NULL,
	`created_at` text DEFAULT '2026-04-13T17:48:47.317Z' NOT NULL,
	`updated_at` text DEFAULT '2026-04-13T17:48:47.317Z' NOT NULL,
	`deleted_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Cliente_uuid_unique` ON `Cliente` (`uuid`);--> statement-breakpoint
CREATE TABLE `Componente` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uuid` text NOT NULL,
	`nombre` text NOT NULL,
	`unidad_medida` text NOT NULL,
	`stock_actual` real DEFAULT 0 NOT NULL,
	`stock_minimo` real DEFAULT 0 NOT NULL,
	`costo_unitario` integer DEFAULT 0 NOT NULL,
	`perfil_negocio_uuid` text NOT NULL,
	`created_at` text DEFAULT '2026-04-13T17:48:47.317Z' NOT NULL,
	`deleted_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Componente_uuid_unique` ON `Componente` (`uuid`);--> statement-breakpoint
CREATE TABLE `Factura` (
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
	`created_at` text DEFAULT '2026-04-13T17:48:47.317Z' NOT NULL,
	`updated_at` text DEFAULT '2026-04-13T17:48:47.317Z' NOT NULL,
	`deleted_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Factura_uuid_unique` ON `Factura` (`uuid`);--> statement-breakpoint
CREATE UNIQUE INDEX `Factura_numero_factura_unique` ON `Factura` (`numero_factura`);--> statement-breakpoint
CREATE TABLE `Feature` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uuid` text NOT NULL,
	`nombre` text NOT NULL,
	`habilitado` integer DEFAULT 1 NOT NULL,
	`perfil_negocio_uuid` text,
	`updated_at` text DEFAULT '2026-04-13T17:48:47.317Z' NOT NULL,
	`deleted_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Feature_uuid_unique` ON `Feature` (`uuid`);--> statement-breakpoint
CREATE TABLE `Orden` (
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
	`created_at` text DEFAULT '2026-04-13T17:48:47.317Z' NOT NULL,
	`updated_at` text DEFAULT '2026-04-13T17:48:47.317Z' NOT NULL,
	`updated_by_uuid` text,
	`deleted_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Orden_uuid_unique` ON `Orden` (`uuid`);--> statement-breakpoint
CREATE TABLE `OrdenProducto` (
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
	`created_at` text DEFAULT '2026-04-13T17:48:47.317Z' NOT NULL,
	`updated_at` text DEFAULT '2026-04-13T17:48:47.317Z' NOT NULL,
	`updated_by_uuid` text,
	`deleted_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `OrdenProducto_uuid_unique` ON `OrdenProducto` (`uuid`);--> statement-breakpoint
CREATE TABLE `Pago` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uuid` text NOT NULL,
	`orden_uuid` text,
	`factura_uuid` text,
	`tipo_pago_uuid` text NOT NULL,
	`monto` integer DEFAULT 0 NOT NULL,
	`referencia` text,
	`estado` text DEFAULT 'PENDIENTE' NOT NULL,
	`estado_sync` text DEFAULT 'PENDIENTE' NOT NULL,
	`fecha_pago` text DEFAULT '2026-04-13T17:48:47.317Z' NOT NULL,
	`created_at` text DEFAULT '2026-04-13T17:48:47.317Z' NOT NULL,
	`updated_at` text DEFAULT '2026-04-13T17:48:47.317Z' NOT NULL,
	`updated_by_uuid` text,
	`deleted_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Pago_uuid_unique` ON `Pago` (`uuid`);--> statement-breakpoint
CREATE TABLE `PerfilNegocio` (
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
	`created_at` text DEFAULT '2026-04-13T17:48:47.316Z' NOT NULL,
	`updated_at` text DEFAULT '2026-04-13T17:48:47.316Z' NOT NULL,
	`deleted_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `PerfilNegocio_uuid_unique` ON `PerfilNegocio` (`uuid`);--> statement-breakpoint
CREATE TABLE `Permiso` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uuid` text NOT NULL,
	`nombre` text NOT NULL,
	`descripcion` text,
	`created_at` text DEFAULT '2026-04-13T17:48:47.317Z' NOT NULL,
	`updated_at` text DEFAULT '2026-04-13T17:48:47.317Z' NOT NULL,
	`updated_by_uuid` text,
	`deleted_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Permiso_uuid_unique` ON `Permiso` (`uuid`);--> statement-breakpoint
CREATE UNIQUE INDEX `Permiso_nombre_unique` ON `Permiso` (`nombre`);--> statement-breakpoint
CREATE TABLE `Plan` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uuid` text NOT NULL,
	`nombre` text NOT NULL,
	`activo` integer DEFAULT 1 NOT NULL,
	`perfil_negocio_uuid` text,
	`updated_at` text DEFAULT '2026-04-13T17:48:47.317Z' NOT NULL,
	`deleted_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Plan_uuid_unique` ON `Plan` (`uuid`);--> statement-breakpoint
CREATE TABLE `Producto` (
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
	`created_at` text DEFAULT '2026-04-13T17:48:47.317Z' NOT NULL,
	`updated_at` text,
	`updated_by_uuid` text,
	`deleted_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Producto_uuid_unique` ON `Producto` (`uuid`);--> statement-breakpoint
CREATE TABLE `ProductoComponente` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uuid` text NOT NULL,
	`producto_uuid` text NOT NULL,
	`componente_uuid` text NOT NULL,
	`cantidad` real DEFAULT 1 NOT NULL,
	`estado_sync` text DEFAULT 'PENDIENTE',
	`created_at` text DEFAULT '2026-04-13T17:48:47.317Z' NOT NULL,
	`updated_at` text DEFAULT '2026-04-13T17:48:47.317Z' NOT NULL,
	`updated_by_uuid` text,
	`deleted_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `ProductoComponente_uuid_unique` ON `ProductoComponente` (`uuid`);--> statement-breakpoint
CREATE TABLE `Sesion` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uuid` text NOT NULL,
	`usuario_uuid` text NOT NULL,
	`token` text NOT NULL,
	`expira_en` text NOT NULL,
	`ultimo_login` text DEFAULT '2026-04-13T17:48:47.317Z' NOT NULL,
	`activo` integer DEFAULT 1 NOT NULL,
	`estado_sync` text DEFAULT 'PENDIENTE' NOT NULL,
	`deleted_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Sesion_uuid_unique` ON `Sesion` (`uuid`);--> statement-breakpoint
CREATE TABLE `TipoPago` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uuid` text NOT NULL,
	`nombre` text NOT NULL,
	`activo` integer DEFAULT 1 NOT NULL,
	`created_at` text DEFAULT '2026-04-13T17:48:47.317Z' NOT NULL,
	`updated_at` text DEFAULT '2026-04-13T17:48:47.317Z' NOT NULL,
	`updated_by_uuid` text,
	`deleted_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `TipoPago_uuid_unique` ON `TipoPago` (`uuid`);--> statement-breakpoint
CREATE TABLE `Usuario` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uuid` text NOT NULL,
	`nombre` text NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`rol` text NOT NULL,
	`perfil_negocio_uuid` text NOT NULL,
	`activo` integer DEFAULT 1 NOT NULL,
	`created_at` text DEFAULT '2026-04-13T17:48:47.317Z' NOT NULL,
	`deleted_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Usuario_uuid_unique` ON `Usuario` (`uuid`);--> statement-breakpoint
CREATE UNIQUE INDEX `Usuario_email_unique` ON `Usuario` (`email`);--> statement-breakpoint
CREATE TABLE `UsuarioPermiso` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uuid` text NOT NULL,
	`usuario_uuid` text NOT NULL,
	`permiso_uuid` text NOT NULL,
	`deleted_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `UsuarioPermiso_uuid_unique` ON `UsuarioPermiso` (`uuid`);