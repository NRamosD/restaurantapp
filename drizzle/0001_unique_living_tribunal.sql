PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_app_config` (
	`clave` text PRIMARY KEY NOT NULL,
	`valor` text
);
--> statement-breakpoint
INSERT INTO `__new_app_config`("clave", "valor") SELECT "clave", "valor" FROM `app_config`;--> statement-breakpoint
DROP TABLE `app_config`;--> statement-breakpoint
ALTER TABLE `__new_app_config` RENAME TO `app_config`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
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
	`created_at` text DEFAULT '2026-03-31T03:21:40.413Z' NOT NULL,
	`updated_at` text DEFAULT '2026-03-31T03:21:40.413Z' NOT NULL,
	`deleted_at` text
);
--> statement-breakpoint
INSERT INTO `__new_Cliente`("id", "uuid", "nombre", "tipo_identificacion", "identificacion", "direccion", "telefono", "email", "estado_sync", "created_at", "updated_at", "deleted_at") SELECT "id", "uuid", "nombre", "tipo_identificacion", "identificacion", "direccion", "telefono", "email", "estado_sync", "created_at", "updated_at", "deleted_at" FROM `Cliente`;--> statement-breakpoint
DROP TABLE `Cliente`;--> statement-breakpoint
ALTER TABLE `__new_Cliente` RENAME TO `Cliente`;--> statement-breakpoint
CREATE UNIQUE INDEX `Cliente_uuid_unique` ON `Cliente` (`uuid`);--> statement-breakpoint
CREATE TABLE `__new_Componente` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uuid` text NOT NULL,
	`nombre` text NOT NULL,
	`unidad_medida` text NOT NULL,
	`stock_actual` real DEFAULT 0 NOT NULL,
	`stock_minimo` real DEFAULT 0 NOT NULL,
	`costo_unitario` integer DEFAULT 0 NOT NULL,
	`perfil_negocio_id` integer NOT NULL,
	`created_at` text DEFAULT '2026-03-31T03:21:40.413Z' NOT NULL,
	`deleted_at` text
);
--> statement-breakpoint
INSERT INTO `__new_Componente`("id", "uuid", "nombre", "unidad_medida", "stock_actual", "stock_minimo", "costo_unitario", "perfil_negocio_id", "created_at", "deleted_at") SELECT "id", "uuid", "nombre", "unidad_medida", "stock_actual", "stock_minimo", "costo_unitario", "perfil_negocio_id", "created_at", "deleted_at" FROM `Componente`;--> statement-breakpoint
DROP TABLE `Componente`;--> statement-breakpoint
ALTER TABLE `__new_Componente` RENAME TO `Componente`;--> statement-breakpoint
CREATE UNIQUE INDEX `Componente_uuid_unique` ON `Componente` (`uuid`);--> statement-breakpoint
CREATE TABLE `__new_Factura` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uuid` text NOT NULL,
	`numero_factura` text NOT NULL,
	`clave_acceso` text NOT NULL,
	`cliente_id` integer NOT NULL,
	`orden_id` integer,
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
	`created_at` text DEFAULT '2026-03-31T03:21:40.413Z' NOT NULL,
	`updated_at` text DEFAULT '2026-03-31T03:21:40.413Z' NOT NULL,
	`deleted_at` text
);
--> statement-breakpoint
INSERT INTO `__new_Factura`("id", "uuid", "numero_factura", "clave_acceso", "cliente_id", "orden_id", "fecha_emision", "subtotal_0", "subtotal_iva", "subtotal", "descuento", "iva", "total", "estado_sri", "estado_sync", "pdf_url", "created_at", "updated_at", "deleted_at") SELECT "id", "uuid", "numero_factura", "clave_acceso", "cliente_id", "orden_id", "fecha_emision", "subtotal_0", "subtotal_iva", "subtotal", "descuento", "iva", "total", "estado_sri", "estado_sync", "pdf_url", "created_at", "updated_at", "deleted_at" FROM `Factura`;--> statement-breakpoint
DROP TABLE `Factura`;--> statement-breakpoint
ALTER TABLE `__new_Factura` RENAME TO `Factura`;--> statement-breakpoint
CREATE UNIQUE INDEX `Factura_uuid_unique` ON `Factura` (`uuid`);--> statement-breakpoint
CREATE UNIQUE INDEX `Factura_numero_factura_unique` ON `Factura` (`numero_factura`);--> statement-breakpoint
CREATE TABLE `__new_Feature` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uuid` text NOT NULL,
	`nombre` text NOT NULL,
	`habilitado` integer DEFAULT 1 NOT NULL,
	`perfil_negocio_id` integer,
	`updated_at` text DEFAULT '2026-03-31T03:21:40.413Z' NOT NULL,
	`deleted_at` text
);
--> statement-breakpoint
INSERT INTO `__new_Feature`("id", "uuid", "nombre", "habilitado", "perfil_negocio_id", "updated_at", "deleted_at") SELECT "id", "uuid", "nombre", "habilitado", "perfil_negocio_id", "updated_at", "deleted_at" FROM `Feature`;--> statement-breakpoint
DROP TABLE `Feature`;--> statement-breakpoint
ALTER TABLE `__new_Feature` RENAME TO `Feature`;--> statement-breakpoint
CREATE UNIQUE INDEX `Feature_uuid_unique` ON `Feature` (`uuid`);--> statement-breakpoint
CREATE TABLE `__new_Orden` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uuid` text NOT NULL,
	`numero_orden` integer,
	`cliente_id` integer,
	`usuario_id` integer NOT NULL,
	`tipo` text NOT NULL,
	`estado` text DEFAULT 'PENDIENTE' NOT NULL,
	`estado_sync` text DEFAULT 'PENDIENTE' NOT NULL,
	`subtotal` integer DEFAULT 0 NOT NULL,
	`iva` integer DEFAULT 0 NOT NULL,
	`total` integer DEFAULT 0 NOT NULL,
	`observaciones` text,
	`created_at` text DEFAULT '2026-03-31T03:21:40.413Z' NOT NULL,
	`updated_at` text DEFAULT '2026-03-31T03:21:40.413Z' NOT NULL,
	`updated_by` integer,
	`deleted_at` text
);
--> statement-breakpoint
INSERT INTO `__new_Orden`("id", "uuid", "numero_orden", "cliente_id", "usuario_id", "tipo", "estado", "estado_sync", "subtotal", "iva", "total", "observaciones", "created_at", "updated_at", "updated_by", "deleted_at") SELECT "id", "uuid", "numero_orden", "cliente_id", "usuario_id", "tipo", "estado", "estado_sync", "subtotal", "iva", "total", "observaciones", "created_at", "updated_at", "updated_by", "deleted_at" FROM `Orden`;--> statement-breakpoint
DROP TABLE `Orden`;--> statement-breakpoint
ALTER TABLE `__new_Orden` RENAME TO `Orden`;--> statement-breakpoint
CREATE UNIQUE INDEX `Orden_uuid_unique` ON `Orden` (`uuid`);--> statement-breakpoint
CREATE TABLE `__new_OrdenProducto` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uuid` text NOT NULL,
	`orden_id` integer NOT NULL,
	`producto_id` integer NOT NULL,
	`cantidad` integer DEFAULT 1 NOT NULL,
	`precio_unitario` integer DEFAULT 0 NOT NULL,
	`descuento` integer DEFAULT 0 NOT NULL,
	`subtotal` integer DEFAULT 0 NOT NULL,
	`iva` integer DEFAULT 0 NOT NULL,
	`total` integer DEFAULT 0 NOT NULL,
	`estado_sync` text DEFAULT 'PENDIENTE' NOT NULL,
	`notas` text,
	`created_at` text DEFAULT '2026-03-31T03:21:40.413Z' NOT NULL,
	`updated_at` text DEFAULT '2026-03-31T03:21:40.413Z' NOT NULL,
	`updated_by` integer,
	`deleted_at` text
);
--> statement-breakpoint
INSERT INTO `__new_OrdenProducto`("id", "uuid", "orden_id", "producto_id", "cantidad", "precio_unitario", "descuento", "subtotal", "iva", "total", "estado_sync", "notas", "created_at", "updated_at", "updated_by", "deleted_at") SELECT "id", "uuid", "orden_id", "producto_id", "cantidad", "precio_unitario", "descuento", "subtotal", "iva", "total", "estado_sync", "notas", "created_at", "updated_at", "updated_by", "deleted_at" FROM `OrdenProducto`;--> statement-breakpoint
DROP TABLE `OrdenProducto`;--> statement-breakpoint
ALTER TABLE `__new_OrdenProducto` RENAME TO `OrdenProducto`;--> statement-breakpoint
CREATE UNIQUE INDEX `OrdenProducto_uuid_unique` ON `OrdenProducto` (`uuid`);--> statement-breakpoint
CREATE TABLE `__new_Pago` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uuid` text NOT NULL,
	`orden_id` integer,
	`factura_id` integer,
	`tipo_pago_id` integer NOT NULL,
	`monto` integer DEFAULT 0 NOT NULL,
	`referencia` text,
	`estado` text DEFAULT 'PENDIENTE' NOT NULL,
	`estado_sync` text DEFAULT 'PENDIENTE' NOT NULL,
	`fecha_pago` text DEFAULT '2026-03-31T03:21:40.413Z' NOT NULL,
	`created_at` text DEFAULT '2026-03-31T03:21:40.413Z' NOT NULL,
	`updated_at` text DEFAULT '2026-03-31T03:21:40.413Z' NOT NULL,
	`updated_by` integer,
	`deleted_at` text
);
--> statement-breakpoint
INSERT INTO `__new_Pago`("id", "uuid", "orden_id", "factura_id", "tipo_pago_id", "monto", "referencia", "estado", "estado_sync", "fecha_pago", "created_at", "updated_at", "updated_by", "deleted_at") SELECT "id", "uuid", "orden_id", "factura_id", "tipo_pago_id", "monto", "referencia", "estado", "estado_sync", "fecha_pago", "created_at", "updated_at", "updated_by", "deleted_at" FROM `Pago`;--> statement-breakpoint
DROP TABLE `Pago`;--> statement-breakpoint
ALTER TABLE `__new_Pago` RENAME TO `Pago`;--> statement-breakpoint
CREATE UNIQUE INDEX `Pago_uuid_unique` ON `Pago` (`uuid`);--> statement-breakpoint
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
	`created_at` text DEFAULT '2026-03-31T03:21:40.411Z' NOT NULL,
	`updated_at` text DEFAULT '2026-03-31T03:21:40.412Z' NOT NULL,
	`deleted_at` text
);
--> statement-breakpoint
INSERT INTO `__new_PerfilNegocio`("id", "uuid", "nombre_comercial", "razon_social", "ruc", "direccion", "telefono", "email", "obligado_contabilidad", "regimen_rimpe", "ambiente", "tipo_emision", "secuencia_factura_actual", "secuencia_orden_actual", "created_at", "updated_at", "deleted_at") SELECT "id", "uuid", "nombre_comercial", "razon_social", "ruc", "direccion", "telefono", "email", "obligado_contabilidad", "regimen_rimpe", "ambiente", "tipo_emision", "secuencia_factura_actual", "secuencia_orden_actual", "created_at", "updated_at", "deleted_at" FROM `PerfilNegocio`;--> statement-breakpoint
DROP TABLE `PerfilNegocio`;--> statement-breakpoint
ALTER TABLE `__new_PerfilNegocio` RENAME TO `PerfilNegocio`;--> statement-breakpoint
CREATE UNIQUE INDEX `PerfilNegocio_uuid_unique` ON `PerfilNegocio` (`uuid`);--> statement-breakpoint
CREATE TABLE `__new_Permiso` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uuid` text NOT NULL,
	`nombre` text NOT NULL,
	`descripcion` text,
	`created_at` text DEFAULT '2026-03-31T03:21:40.412Z' NOT NULL,
	`updated_at` text DEFAULT '2026-03-31T03:21:40.412Z' NOT NULL,
	`updated_by` integer,
	`deleted_at` text
);
--> statement-breakpoint
INSERT INTO `__new_Permiso`("id", "uuid", "nombre", "descripcion", "created_at", "updated_at", "updated_by", "deleted_at") SELECT "id", "uuid", "nombre", "descripcion", "created_at", "updated_at", "updated_by", "deleted_at" FROM `Permiso`;--> statement-breakpoint
DROP TABLE `Permiso`;--> statement-breakpoint
ALTER TABLE `__new_Permiso` RENAME TO `Permiso`;--> statement-breakpoint
CREATE UNIQUE INDEX `Permiso_uuid_unique` ON `Permiso` (`uuid`);--> statement-breakpoint
CREATE UNIQUE INDEX `Permiso_nombre_unique` ON `Permiso` (`nombre`);--> statement-breakpoint
CREATE TABLE `__new_Plan` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uuid` text NOT NULL,
	`nombre` text NOT NULL,
	`activo` integer DEFAULT 1 NOT NULL,
	`perfil_negocio_id` integer,
	`updated_at` text DEFAULT '2026-03-31T03:21:40.413Z' NOT NULL,
	`deleted_at` text
);
--> statement-breakpoint
INSERT INTO `__new_Plan`("id", "uuid", "nombre", "activo", "perfil_negocio_id", "updated_at", "deleted_at") SELECT "id", "uuid", "nombre", "activo", "perfil_negocio_id", "updated_at", "deleted_at" FROM `Plan`;--> statement-breakpoint
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
	`perfil_negocio_id` integer NOT NULL,
	`estado_sync` text DEFAULT 'PENDIENTE' NOT NULL,
	`created_at` text DEFAULT '2026-03-31T03:21:40.413Z' NOT NULL,
	`updated_at` text,
	`updated_by` integer,
	`deleted_at` text
);
--> statement-breakpoint
INSERT INTO `__new_Producto`("id", "uuid", "nombre", "descripcion", "precio", "aplica_iva", "porcentaje_iva", "stock", "ilimitado", "imagen_url", "galeria", "estado", "perfil_negocio_id", "estado_sync", "created_at", "updated_at", "updated_by", "deleted_at") SELECT "id", "uuid", "nombre", "descripcion", "precio", "aplica_iva", "porcentaje_iva", "stock", "ilimitado", "imagen_url", "galeria", "estado", "perfil_negocio_id", "estado_sync", "created_at", "updated_at", "updated_by", "deleted_at" FROM `Producto`;--> statement-breakpoint
DROP TABLE `Producto`;--> statement-breakpoint
ALTER TABLE `__new_Producto` RENAME TO `Producto`;--> statement-breakpoint
CREATE UNIQUE INDEX `Producto_uuid_unique` ON `Producto` (`uuid`);--> statement-breakpoint
CREATE TABLE `__new_ProductoComponente` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uuid` text NOT NULL,
	`producto_id` integer NOT NULL,
	`componente_id` integer NOT NULL,
	`cantidad` real DEFAULT 1 NOT NULL,
	`estado_sync` text DEFAULT 'PENDIENTE',
	`created_at` text DEFAULT '2026-03-31T03:21:40.413Z' NOT NULL,
	`updated_at` text DEFAULT '2026-03-31T03:21:40.413Z' NOT NULL,
	`updated_by` integer,
	`deleted_at` text
);
--> statement-breakpoint
INSERT INTO `__new_ProductoComponente`("id", "uuid", "producto_id", "componente_id", "cantidad", "estado_sync", "created_at", "updated_at", "updated_by", "deleted_at") SELECT "id", "uuid", "producto_id", "componente_id", "cantidad", "estado_sync", "created_at", "updated_at", "updated_by", "deleted_at" FROM `ProductoComponente`;--> statement-breakpoint
DROP TABLE `ProductoComponente`;--> statement-breakpoint
ALTER TABLE `__new_ProductoComponente` RENAME TO `ProductoComponente`;--> statement-breakpoint
CREATE UNIQUE INDEX `ProductoComponente_uuid_unique` ON `ProductoComponente` (`uuid`);--> statement-breakpoint
CREATE TABLE `__new_Sesion` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uuid` text NOT NULL,
	`usuario_id` integer NOT NULL,
	`token` text NOT NULL,
	`expira_en` text NOT NULL,
	`ultimo_login` text DEFAULT '2026-03-31T03:21:40.412Z' NOT NULL,
	`activo` integer DEFAULT 1 NOT NULL,
	`estado_sync` text DEFAULT 'PENDIENTE' NOT NULL,
	`deleted_at` text
);
--> statement-breakpoint
INSERT INTO `__new_Sesion`("id", "uuid", "usuario_id", "token", "expira_en", "ultimo_login", "activo", "estado_sync", "deleted_at") SELECT "id", "uuid", "usuario_id", "token", "expira_en", "ultimo_login", "activo", "estado_sync", "deleted_at" FROM `Sesion`;--> statement-breakpoint
DROP TABLE `Sesion`;--> statement-breakpoint
ALTER TABLE `__new_Sesion` RENAME TO `Sesion`;--> statement-breakpoint
CREATE UNIQUE INDEX `Sesion_uuid_unique` ON `Sesion` (`uuid`);--> statement-breakpoint
CREATE TABLE `__new_TipoPago` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uuid` text NOT NULL,
	`nombre` text NOT NULL,
	`activo` integer DEFAULT 1 NOT NULL,
	`created_at` text DEFAULT '2026-03-31T03:21:40.413Z' NOT NULL,
	`updated_at` text DEFAULT '2026-03-31T03:21:40.413Z' NOT NULL,
	`updated_by` integer,
	`deleted_at` text
);
--> statement-breakpoint
INSERT INTO `__new_TipoPago`("id", "uuid", "nombre", "activo", "created_at", "updated_at", "updated_by", "deleted_at") SELECT "id", "uuid", "nombre", "activo", "created_at", "updated_at", "updated_by", "deleted_at" FROM `TipoPago`;--> statement-breakpoint
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
	`perfil_negocio_id` integer NOT NULL,
	`activo` integer DEFAULT 1 NOT NULL,
	`created_at` text DEFAULT '2026-03-31T03:21:40.412Z' NOT NULL,
	`deleted_at` text
);
--> statement-breakpoint
INSERT INTO `__new_Usuario`("id", "uuid", "nombre", "email", "password_hash", "rol", "perfil_negocio_id", "activo", "created_at", "deleted_at") SELECT "id", "uuid", "nombre", "email", "password_hash", "rol", "perfil_negocio_id", "activo", "created_at", "deleted_at" FROM `Usuario`;--> statement-breakpoint
DROP TABLE `Usuario`;--> statement-breakpoint
ALTER TABLE `__new_Usuario` RENAME TO `Usuario`;--> statement-breakpoint
CREATE UNIQUE INDEX `Usuario_uuid_unique` ON `Usuario` (`uuid`);--> statement-breakpoint
CREATE UNIQUE INDEX `Usuario_email_unique` ON `Usuario` (`email`);
--> statement-breakpoint
INSERT INTO PerfilNegocio (uuid, nombre_comercial, razon_social, ruc, direccion, telefono, email, obligado_contabilidad, regimen_rimpe, ambiente, secuencia_factura_actual, secuencia_orden_actual) VALUES
('perfil-001', 'Restaurante El Palé', 'El Palé Restaurantes C.A.', '1234567890001', 'Av. Principal 123, Quito', '0991234567', 'elpale@restaurante.com', 1, 1, 'PRUEBAS', 0, 1),
('perfil-002', 'Pizzería Napoli', 'Napoli Food Services', '1234567890002', 'Av. Colon 456, Guayaquil', '0987654321', 'napoli@pizzeria.com', 1, 0, 'PRUEBAS', 0, 1),
('perfil-003', 'Fast Food BurgerKing', 'BurgerKing Ecuador', '1234567890003', 'Av. Amazonas 789, Quito', '0976543210', 'burger@fastfood.com', 1, 1, 'PRODUCCION', 100, 50);
--> statement-breakpoint
INSERT INTO Usuario (uuid, nombre, email, password_hash, rol, perfil_negocio_id) VALUES
('user-001', 'Juan Administrator', 'juan@elpale.com', '$2b$10$D1ZAZJOsVNL70y3gNiQZ3.IkvswY.eoMsBL5OcD80vPZGzHGUGif.', 'ADMIN', 1),
('user-002', 'Maria Cajera', 'maria@elpale.com', '$2b$10$D1ZAZJOsVNL70y3gNiQZ3.IkvswY.eoMsBL5OcD80vPZGzHGUGif.', 'CAJERO', 1),
('user-003', 'Pedro Mesero', 'pedro@elpale.com', '$2b$10$D1ZAZJOsVNL70y3gNiQZ3.IkvswY.eoMsBL5OcD80vPZGzHGUGif.', 'MESERO', 1);
--> statement-breakpoint
INSERT INTO Sesion (uuid, usuario_id, token, expira_en, activo) VALUES
('sesion-001', 1, 'token-juan-001', datetime('now', '+7 days'), 1),
('sesion-002', 2, 'token-maria-001', datetime('now', '+7 days'), 1),
('sesion-003', 3, 'token-pedro-001', datetime('now', '+7 days'), 1);
--> statement-breakpoint
INSERT INTO Permiso (uuid, nombre, descripcion) VALUES
('permiso-001', 'CREAR_ORDEN', 'Permite crear nuevas ordenes'),
('permiso-002', 'VER_REPORTES', 'Permite ver reportes del negocio'),
('permiso-003', 'FACTURAR', 'Permite generar facturas electronicas'),
('permiso-004', 'GESTIONAR_PRODUCTOS', 'Permite agregar/modificar productos'),
('permiso-005', 'GESTIONAR_USUARIOS', 'Permite administrar usuarios del sistema');
--> statement-breakpoint
INSERT INTO UsuarioPermiso (uuid, usuario_id, permiso_id) VALUES
('usuariopermiso-001', 1, 1),
('usuariopermiso-002', 1, 2),
('usuariopermiso-003', 1, 3);
--> statement-breakpoint
INSERT INTO Cliente (uuid, nombre, tipo_identificacion, identificacion, direccion, telefono, email) VALUES
('cliente-001', 'Carlos Rodriguez', 'CEDULA', '1712345678', 'Av. Eloy Alfaro 123', '0991112233', 'carlos@email.com'),
('cliente-002', 'Maria Garcia', 'RUC', '1234567890001', 'Av. Republica 456', '0994445566', 'maria@empresa.com'),
('cliente-003', 'Consumidor Final', 'CONSUMIDOR_FINAL', '9999999999', 'N/A', '0000000000', NULL);
--> statement-breakpoint
INSERT INTO Producto (uuid, nombre, descripcion, precio, aplica_iva, porcentaje_iva, stock, ilimitado, imagen_url, estado, perfil_negocio_id) VALUES
('producto-001', 'Hamburguesa Clasica', 'Hamburguesa con queso, lechuga y tomate', 599, 1, 12.0, 50, 0, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd', 'DISPONIBLE', 1),
('producto-002', 'Pizza Margarita', 'Pizza con salsa de tomate, mozzarella y albahaca', 850, 1, 12.0, 30, 0, 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3', 'DISPONIBLE', 1),
('producto-003', 'Ensalada Caesar', 'Ensalada con pollo, crutones y aderezo cesar', 450, 1, 12.0, 20, 0, 'https://images.unsplash.com/photo-1546793665-c74683f339c1', 'DISPONIBLE', 1);
--> statement-breakpoint
INSERT INTO Componente (uuid, nombre, unidad_medida, stock_actual, stock_minimo, costo_unitario, perfil_negocio_id) VALUES
('componente-001', 'Pan de Hamburguesa', 'unidad', 100, 20, 50, 1),
('componente-002', 'Carne de Res', 'kg', 25, 5, 1200, 1),
('componente-003', 'Queso Cheddar', 'kg', 10, 2, 800, 1);
--> statement-breakpoint
INSERT INTO ProductoComponente (uuid, producto_id, componente_id, cantidad) VALUES
('prodcomp-001', 1, 1, 1),
('prodcomp-002', 1, 2, 0.2),
('prodcomp-003', 1, 3, 0.05);
--> statement-breakpoint
INSERT INTO Orden (uuid, numero_orden, cliente_id, usuario_id, tipo, estado, subtotal, iva, total, observaciones) VALUES
('orden-001', 1, 1, 1, 'LOCAL', 'PENDIENTE', 1342, 161, 1503, 'Sin cebolla'),
('orden-002', 2, 2, 2, 'LLEVAR', 'EN_PREPARACION', 952, 114, 1066, NULL),
('orden-003', 3, 3, 3, 'DELIVERY', 'LISTO', 504, 60, 564, 'Urgente');
--> statement-breakpoint
INSERT INTO OrdenProducto (uuid, orden_id, producto_id, cantidad, precio_unitario, descuento, subtotal, iva, total, notas) VALUES
('ordenprod-001', 1, 1, 2, 599, 0, 1198, 144, 1342, 'Con doble queso'),
('ordenprod-002', 2, 2, 1, 850, 0, 850, 102, 952, NULL),
('ordenprod-003', 3, 3, 1, 450, 0, 450, 54, 504, 'Sin crutones');
--> statement-breakpoint
INSERT INTO TipoPago (uuid, nombre, activo) VALUES
('tipopago-001', 'EFECTIVO', 1),
('tipopago-002', 'TARJETA_DEBITO', 1),
('tipopago-003', 'TRANSFERENCIA', 1);
--> statement-breakpoint
INSERT INTO Pago (uuid, orden_id, tipo_pago_id, monto, referencia, estado) VALUES
('pago-001', 1, 1, 1503, NULL, 'COMPLETADO'),
('pago-002', 2, 2, 1066, 'TXN-123456', 'COMPLETADO'),
('pago-003', 3, 3, 564, 'TRF-789012', 'PENDIENTE');
--> statement-breakpoint
INSERT INTO Factura (uuid, numero_factura, clave_acceso, cliente_id, orden_id, fecha_emision, subtotal_0, subtotal_iva, subtotal, descuento, iva, total, estado_sri) VALUES
('factura-001', '001-001-000000001', '12345678901234567890123456789012345678901234567', 1, 1, datetime('now'), 0, 1342, 1342, 0, 161, 1503, 'PENDIENTE'),
('factura-002', '001-001-000000002', '12345678901234567890123456789012345678901234568', 2, 2, datetime('now'), 0, 952, 952, 0, 114, 1066, 'PENDIENTE'),
('factura-003', '001-001-000000003', '12345678901234567890123456789012345678901234569', 3, 3, datetime('now'), 0, 504, 504, 0, 60, 564, 'PENDIENTE');
--> statement-breakpoint
INSERT INTO Plan (uuid, nombre, activo, perfil_negocio_id) VALUES
('plan-001', 'BASICO', 1, 1),
('plan-002', 'PREMIUM', 1, 2),
('plan-003', 'EMPRESARIAL', 1, 3);
--> statement-breakpoint
INSERT INTO Feature (uuid, nombre, habilitado, perfil_negocio_id) VALUES
('feature-001', 'MODULO_FACTURACION', 1, 1),
('feature-002', 'DELIVERY', 1, 1),
('feature-003', 'REPORTES_AVANZADOS', 0, 1);
--> statement-breakpoint
INSERT INTO app_config (clave, valor) VALUES
('environment', 'PRUEBAS'),
('db_version', '1'),
('last_sync', NULL);