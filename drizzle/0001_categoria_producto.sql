CREATE TABLE `CategoriaProducto` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uuid` text NOT NULL,
	`nombre` text NOT NULL,
	`slug` text NOT NULL,
	`activo` integer DEFAULT 1 NOT NULL,
	`created_at` text DEFAULT '2026-04-19T02:13:00.000Z' NOT NULL,
	`updated_at` text DEFAULT '2026-04-19T02:13:00.000Z' NOT NULL,
	`deleted_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `CategoriaProducto_uuid_unique` ON `CategoriaProducto` (`uuid`);--> statement-breakpoint
CREATE UNIQUE INDEX `CategoriaProducto_slug_unique` ON `CategoriaProducto` (`slug`);--> statement-breakpoint
CREATE TABLE `VariacionesProducto` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uuid` text NOT NULL,
	`nombre` text NOT NULL,
	`descripcion` text,
	`created_at` text DEFAULT '2026-04-19T02:13:00.000Z' NOT NULL,
	`updated_at` text DEFAULT '2026-04-19T02:13:00.000Z' NOT NULL,
	`deleted_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `VariacionesProducto_uuid_unique` ON `VariacionesProducto` (`uuid`);--> statement-breakpoint
CREATE TABLE `ProductoOpciones` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uuid` text NOT NULL,
	`producto_uuid` text NOT NULL,
	`nombre` text NOT NULL,
	`descripcion` text,
	`valor_adicional` integer DEFAULT 0 NOT NULL,
	`orden` integer DEFAULT 0 NOT NULL,
	`activo` integer DEFAULT 1 NOT NULL,
	`estado_sync` text DEFAULT 'PENDIENTE' NOT NULL,
	`created_at` text DEFAULT '2026-04-19T02:13:00.000Z' NOT NULL,
	`updated_at` text DEFAULT '2026-04-19T02:13:00.000Z' NOT NULL,
	`updated_by_uuid` text,
	`deleted_at` text,
	FOREIGN KEY (`producto_uuid`) REFERENCES `Producto`(`uuid`)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `ProductoOpciones_uuid_unique` ON `ProductoOpciones` (`uuid`);--> statement-breakpoint
INSERT OR IGNORE INTO `CategoriaProducto` (`uuid`, `nombre`, `slug`, `activo`) VALUES
	('bb5a41a2-7a8c-42bf-90f7-d7497e428101', 'Comida', 'comida', 1),
	('ed889bdc-0e75-4d26-8783-a2b688240202', 'Entrada', 'entrada', 1),
	('c5a2eb88-3bdf-4e38-96f2-34b98258d303', 'Plato Fuerte', 'plato_fuerte', 1),
	('e2cc18cb-f63f-4275-a364-2ac857d38404', 'Comida Rápida', 'comida_rapida', 1),
	('22845d4f-3b2f-4634-8208-6d2e6c670505', 'Bebidas', 'bebidas', 1),
	('1535441b-faec-45f2-8481-53d38972f106', 'Adicionales', 'adicionales', 1),
	('2714b273-978f-42e3-910b-a9f211d07707', 'Postres', 'postres', 1);
--> statement-breakpoint
ALTER TABLE `Producto` ADD `categoria_producto_uuid` text REFERENCES `CategoriaProducto`(`uuid`);--> statement-breakpoint
ALTER TABLE `Producto` ADD `variaciones_producto_uuid` text REFERENCES `VariacionesProducto`(`uuid`);
