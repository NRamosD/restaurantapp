-- =============================================
-- RestaurantApp - SQLite Schema
-- Based on general.interface.ts
-- =============================================

PRAGMA foreign_keys = ON;

-- =============================================
-- PERFIL NEGOCIO (Company/Business Profile)
-- =============================================
CREATE TABLE IF NOT EXISTS PerfilNegocio (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT NOT NULL UNIQUE,
    nombre_comercial TEXT NOT NULL,
    razon_social TEXT NOT NULL,
    ruc TEXT NOT NULL,
    direccion TEXT NOT NULL,
    telefono TEXT,
    email TEXT,
    obligado_contabilidad INTEGER NOT NULL DEFAULT 0,
    regimen_rimpe INTEGER,
    ambiente TEXT NOT NULL DEFAULT 'PRUEBAS' CHECK(ambiente IN ('PRUEBAS', 'PRODUCCION')),
    tipo_emision TEXT NOT NULL DEFAULT 'NORMAL' CHECK(tipo_emision IN ('NORMAL', 'CONTINGENCIA')),
    secuencia_factura_actual INTEGER NOT NULL DEFAULT 0,
    secuencia_orden_actual INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    deleted_at TEXT
);

-- =============================================
-- USUARIO (User)
-- =============================================
CREATE TABLE IF NOT EXISTS Usuario (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT NOT NULL UNIQUE,
    nombre TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    rol TEXT NOT NULL CHECK(rol IN ('ADMIN', 'CAJERO', 'MESERO', 'COCINA')),
    perfil_negocio_id INTEGER NOT NULL,
    activo INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    deleted_at TEXT,
    FOREIGN KEY (perfil_negocio_id) REFERENCES PerfilNegocio(id)
);

-- =============================================
-- SESION (Session)
-- =============================================
CREATE TABLE IF NOT EXISTS Sesion (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT NOT NULL UNIQUE,
    usuario_id INTEGER NOT NULL,
    token TEXT NOT NULL,
    expira_en TEXT NOT NULL,
    ultimo_login TEXT NOT NULL DEFAULT (datetime('now')),
    activo INTEGER NOT NULL DEFAULT 1,
    estado_sync TEXT NOT NULL DEFAULT 'PENDIENTE' CHECK(estado_sync IN ('PENDIENTE', 'SINCRONIZADO')),
    deleted_at TEXT,
    FOREIGN KEY (usuario_id) REFERENCES Usuario(id)
);

-- =============================================
-- PERMISO (Permission)
-- =============================================
CREATE TABLE IF NOT EXISTS Permiso (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT NOT NULL UNIQUE,
    nombre TEXT NOT NULL UNIQUE,
    descripcion TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_by INTEGER,
    deleted_at TEXT
);

-- =============================================
-- USUARIO PERMISO (User Permission)
-- =============================================
CREATE TABLE IF NOT EXISTS UsuarioPermiso (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT NOT NULL UNIQUE,
    usuario_id INTEGER NOT NULL,
    permiso_id INTEGER NOT NULL,
    deleted_at TEXT,
    FOREIGN KEY (usuario_id) REFERENCES Usuario(id),
    FOREIGN KEY (permiso_id) REFERENCES Permiso(id),
    UNIQUE(usuario_id, permiso_id)
);

-- =============================================
-- CLIENTE (Customer)
-- =============================================
CREATE TABLE IF NOT EXISTS Cliente (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT NOT NULL UNIQUE,
    nombre TEXT NOT NULL,
    tipo_identificacion TEXT NOT NULL CHECK(tipo_identificacion IN ('CEDULA', 'RUC', 'PASAPORTE', 'CONSUMIDOR_FINAL')),
    identificacion TEXT NOT NULL,
    direccion TEXT,
    telefono TEXT,
    email TEXT,
    estado_sync TEXT NOT NULL DEFAULT 'PENDIENTE' CHECK(estado_sync IN ('PENDIENTE', 'SINCRONIZADO')),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    deleted_at TEXT
);

-- =============================================
-- PRODUCTO (Product)
-- =============================================
CREATE TABLE IF NOT EXISTS Producto (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT NOT NULL UNIQUE,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    precio INTEGER NOT NULL,
    aplica_iva INTEGER NOT NULL DEFAULT 1,
    porcentaje_iva REAL NOT NULL DEFAULT 12.0,
    stock INTEGER NOT NULL DEFAULT 0,
    ilimitado INTEGER NOT NULL DEFAULT 0,
    imagen_url TEXT,
    galeria TEXT,
    estado TEXT NOT NULL DEFAULT 'DISPONIBLE' CHECK(estado IN ('DISPONIBLE', 'NO_DISPONIBLE')),
    perfil_negocio_id INTEGER NOT NULL,
    estado_sync TEXT NOT NULL DEFAULT 'PENDIENTE' CHECK(estado_sync IN ('PENDIENTE', 'SINCRONIZADO')),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT,
    updated_by INTEGER,
    deleted_at TEXT,
    FOREIGN KEY (perfil_negocio_id) REFERENCES PerfilNegocio(id)
);

-- =============================================
-- COMPONENTE (Component - Ingredients/Materials)
-- =============================================
CREATE TABLE IF NOT EXISTS Componente (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT NOT NULL UNIQUE,
    nombre TEXT NOT NULL,
    unidad_medida TEXT NOT NULL,
    stock_actual REAL NOT NULL DEFAULT 0,
    stock_minimo REAL NOT NULL DEFAULT 0,
    costo_unitario INTEGER NOT NULL DEFAULT 0,
    perfil_negocio_id INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    deleted_at TEXT,
    FOREIGN KEY (perfil_negocio_id) REFERENCES PerfilNegocio(id)
);

-- =============================================
-- PRODUCTO COMPONENTE (Product Component - Recipe)
-- =============================================
CREATE TABLE IF NOT EXISTS ProductoComponente (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT NOT NULL UNIQUE,
    producto_id INTEGER NOT NULL,
    componente_id INTEGER NOT NULL,
    cantidad REAL NOT NULL DEFAULT 1,
    estado_sync TEXT DEFAULT 'PENDIENTE' CHECK(estado_sync IN ('PENDIENTE', 'SINCRONIZADO')),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_by INTEGER,
    deleted_at TEXT,
    FOREIGN KEY (producto_id) REFERENCES Producto(id),
    FOREIGN KEY (componente_id) REFERENCES Componente(id),
    UNIQUE(producto_id, componente_id)
);

-- =============================================
-- ORDEN (Order)
-- =============================================
CREATE TABLE IF NOT EXISTS Orden (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT NOT NULL UNIQUE,
    numero_orden INTEGER,
    cliente_id INTEGER,
    usuario_id INTEGER NOT NULL,
    tipo TEXT NOT NULL CHECK(tipo IN ('LOCAL', 'LLEVAR', 'DELIVERY')),
    estado TEXT NOT NULL DEFAULT 'PENDIENTE' CHECK(estado IN ('PENDIENTE', 'EN_PREPARACION', 'LISTO', 'ENTREGADO', 'CANCELADO')),
    estado_sync TEXT NOT NULL DEFAULT 'PENDIENTE' CHECK(estado_sync IN ('PENDIENTE', 'SINCRONIZADO')),
    subtotal INTEGER NOT NULL DEFAULT 0,
    iva INTEGER NOT NULL DEFAULT 0,
    total INTEGER NOT NULL DEFAULT 0,
    observaciones TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_by INTEGER,
    deleted_at TEXT,
    FOREIGN KEY (cliente_id) REFERENCES Cliente(id),
    FOREIGN KEY (usuario_id) REFERENCES Usuario(id)
);

-- =============================================
-- ORDEN PRODUCTO (Order Product)
-- =============================================
CREATE TABLE IF NOT EXISTS OrdenProducto (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT NOT NULL UNIQUE,
    orden_id INTEGER NOT NULL,
    producto_id INTEGER NOT NULL,
    cantidad INTEGER NOT NULL DEFAULT 1,
    precio_unitario INTEGER NOT NULL DEFAULT 0,
    descuento INTEGER NOT NULL DEFAULT 0,
    subtotal INTEGER NOT NULL DEFAULT 0,
    iva INTEGER NOT NULL DEFAULT 0,
    total INTEGER NOT NULL DEFAULT 0,
    estado_sync TEXT NOT NULL DEFAULT 'PENDIENTE' CHECK(estado_sync IN ('PENDIENTE', 'SINCRONIZADO')),
    notas TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_by INTEGER,
    deleted_at TEXT,
    FOREIGN KEY (orden_id) REFERENCES Orden(id),
    FOREIGN KEY (producto_id) REFERENCES Producto(id)
);

-- =============================================
-- FACTURA (Invoice)
-- =============================================
CREATE TABLE IF NOT EXISTS Factura (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT NOT NULL UNIQUE,
    numero_factura TEXT NOT NULL UNIQUE,
    clave_acceso TEXT NOT NULL,
    cliente_id INTEGER NOT NULL,
    orden_id INTEGER,
    fecha_emision TEXT NOT NULL,
    subtotal_0 INTEGER NOT NULL DEFAULT 0,
    subtotal_iva INTEGER NOT NULL DEFAULT 0,
    subtotal INTEGER NOT NULL DEFAULT 0,
    descuento INTEGER NOT NULL DEFAULT 0,
    iva INTEGER NOT NULL DEFAULT 0,
    total INTEGER NOT NULL DEFAULT 0,
    estado_sri TEXT NOT NULL DEFAULT 'PENDIENTE' CHECK(estado_sri IN ('PENDIENTE', 'AUTORIZADA', 'RECHAZADA')),
    estado_sync TEXT NOT NULL DEFAULT 'PENDIENTE' CHECK(estado_sync IN ('PENDIENTE', 'SINCRONIZADO')),
    pdf_url TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    deleted_at TEXT,
    FOREIGN KEY (cliente_id) REFERENCES Cliente(id),
    FOREIGN KEY (orden_id) REFERENCES Orden(id)
);

-- =============================================
-- TIPO PAGO (Payment Type)
-- =============================================
CREATE TABLE IF NOT EXISTS TipoPago (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT NOT NULL UNIQUE,
    nombre TEXT NOT NULL,
    activo INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_by INTEGER,
    deleted_at TEXT
);

-- =============================================
-- PAGO (Payment)
-- =============================================
CREATE TABLE IF NOT EXISTS Pago (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT NOT NULL UNIQUE,
    orden_id INTEGER,
    factura_id INTEGER,
    tipo_pago_id INTEGER NOT NULL,
    monto INTEGER NOT NULL DEFAULT 0,
    referencia TEXT,
    estado TEXT NOT NULL DEFAULT 'PENDIENTE' CHECK(estado IN ('PENDIENTE', 'COMPLETADO', 'ANULADO')),
    estado_sync TEXT NOT NULL DEFAULT 'PENDIENTE' CHECK(estado_sync IN ('PENDIENTE', 'SINCRONIZADO')),
    fecha_pago TEXT NOT NULL DEFAULT (datetime('now')),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_by INTEGER,
    deleted_at TEXT,
    FOREIGN KEY (orden_id) REFERENCES Orden(id),
    FOREIGN KEY (factura_id) REFERENCES Factura(id),
    FOREIGN KEY (tipo_pago_id) REFERENCES TipoPago(id)
);

-- =============================================
-- PLAN (Subscription Plan)
-- =============================================
CREATE TABLE IF NOT EXISTS Plan (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT NOT NULL UNIQUE,
    nombre TEXT NOT NULL,
    activo INTEGER NOT NULL DEFAULT 1,
    perfil_negocio_id INTEGER,
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    deleted_at TEXT,
    FOREIGN KEY (perfil_negocio_id) REFERENCES PerfilNegocio(id)
);

-- =============================================
-- FEATURE (Feature Flag)
-- =============================================
CREATE TABLE IF NOT EXISTS Feature (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT NOT NULL UNIQUE,
    nombre TEXT NOT NULL,
    habilitado INTEGER NOT NULL DEFAULT 1,
    perfil_negocio_id INTEGER,
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    deleted_at TEXT,
    FOREIGN KEY (perfil_negocio_id) REFERENCES PerfilNegocio(id)
);

-- =============================================
-- APP CONFIG (App Configuration)
-- =============================================
CREATE TABLE IF NOT EXISTS app_config (
    clave TEXT PRIMARY KEY,
    valor TEXT NOT NULL
);

-- =============================================
-- SEED DATA - PRUEBAS (3+ records per table)
-- =============================================

-- PerfilNegocio (3 registros)
INSERT INTO PerfilNegocio (uuid, nombre_comercial, razon_social, ruc, direccion, telefono, email, obligado_contabilidad, regimen_rimpe, ambiente, secuencia_factura_actual, secuencia_orden_actual) VALUES
('perfil-001', 'Restaurante El Palé', 'El Palé Restaurantes C.A.', '1234567890001', 'Av. Principal 123, Quito', '0991234567', 'elpale@restaurante.com', 1, 1, 'PRUEBAS', 0, 1),
('perfil-002', 'Pizzería Napoli', 'Napoli Food Services', '1234567890002', 'Av. Colon 456, Guayaquil', '0987654321', 'napoli@pizzeria.com', 1, 0, 'PRUEBAS', 0, 1),
('perfil-003', 'Fast Food BurgerKing', 'BurgerKing Ecuador', '1234567890003', 'Av. Amazonas 789, Quito', '0976543210', 'burger@fastfood.com', 1, 1, 'PRODUCCION', 100, 50);

-- Usuario (3 registros)
INSERT INTO Usuario (uuid, nombre, email, password_hash, rol, perfil_negocio_id) VALUES
('user-001', 'Juan Administrator', 'juan@elpale.com', '$2a$10$abcdefghijklmnopqrstuv', 'ADMIN', 1),
('user-002', 'Maria Cajera', 'maria@elpale.com', '$2a$10$abcdefghijklmnopqrstuv', 'CAJERO', 1),
('user-003', 'Pedro Mesero', 'pedro@elpale.com', '$2a$10$abcdefghijklmnopqrstuv', 'MESERO', 1);

-- Sesion (3 registros)
INSERT INTO Sesion (uuid, usuario_id, token, expira_en, activo) VALUES
('sesion-001', 1, 'token-juan-001', datetime('now', '+7 days'), 1),
('sesion-002', 2, 'token-maria-001', datetime('now', '+7 days'), 1),
('sesion-003', 3, 'token-pedro-001', datetime('now', '+7 days'), 1);

-- Permiso (5 registros)
INSERT INTO Permiso (uuid, nombre, descripcion) VALUES
('permiso-001', 'CREAR_ORDEN', 'Permite crear nuevas ordenes'),
('permiso-002', 'VER_REPORTES', 'Permite ver reportes del negocio'),
('permiso-003', 'FACTURAR', 'Permite generar facturas electronicas'),
('permiso-004', 'GESTIONAR_PRODUCTOS', 'Permite agregar/modificar productos'),
('permiso-005', 'GESTIONAR_USUARIOS', 'Permite administrar usuarios del sistema');

-- UsuarioPermiso (3 registros)
INSERT INTO UsuarioPermiso (uuid, usuario_id, permiso_id) VALUES
('usuariopermiso-001', 1, 1),
('usuariopermiso-002', 1, 2),
('usuariopermiso-003', 1, 3);

-- Cliente (3 registros)
INSERT INTO Cliente (uuid, nombre, tipo_identificacion, identificacion, direccion, telefono, email) VALUES
('cliente-001', 'Carlos Rodriguez', 'CEDULA', '1712345678', 'Av. Eloy Alfaro 123', '0991112233', 'carlos@email.com'),
('cliente-002', 'Maria Garcia', 'RUC', '1234567890001', 'Av. Republica 456', '0994445566', 'maria@empresa.com'),
('cliente-003', 'Consumidor Final', 'CONSUMIDOR_FINAL', '9999999999', 'N/A', '0000000000', NULL);

-- Producto (3 registros)
INSERT INTO Producto (uuid, nombre, descripcion, precio, aplica_iva, porcentaje_iva, stock, ilimitado, imagen_url, estado, perfil_negocio_id) VALUES
('producto-001', 'Hamburguesa Clasica', 'Hamburguesa con queso, lechuga y tomate', 599, 1, 12.0, 50, 0, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd', 'DISPONIBLE', 1),
('producto-002', 'Pizza Margarita', 'Pizza con salsa de tomate, mozzarella y albahaca', 850, 1, 12.0, 30, 0, 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3', 'DISPONIBLE', 1),
('producto-003', 'Ensalada Caesar', 'Ensalada con pollo, crutones y aderezo cesar', 450, 1, 12.0, 20, 0, 'https://images.unsplash.com/photo-1546793665-c74683f339c1', 'DISPONIBLE', 1);

-- Componente (3 registros)
INSERT INTO Componente (uuid, nombre, unidad_medida, stock_actual, stock_minimo, costo_unitario, perfil_negocio_id) VALUES
('componente-001', 'Pan de Hamburguesa', 'unidad', 100, 20, 50, 1),
('componente-002', 'Carne de Res', 'kg', 25, 5, 1200, 1),
('componente-003', 'Queso Cheddar', 'kg', 10, 2, 800, 1);

-- ProductoComponente (3 registros)
INSERT INTO ProductoComponente (uuid, producto_id, componente_id, cantidad) VALUES
('prodcomp-001', 1, 1, 1),
('prodcomp-002', 1, 2, 0.2),
('prodcomp-003', 1, 3, 0.05);

-- Orden (3 registros)
INSERT INTO Orden (uuid, numero_orden, cliente_id, usuario_id, tipo, estado, subtotal, iva, total, observaciones) VALUES
('orden-001', 1, 1, 1, 'LOCAL', 'PENDIENTE', 1342, 161, 1503, 'Sin cebolla'),
('orden-002', 2, 2, 2, 'LLEVAR', 'EN_PREPARACION', 952, 114, 1066, NULL),
('orden-003', 3, 3, 3, 'DELIVERY', 'LISTO', 504, 60, 564, 'Urgente');

-- OrdenProducto (3 registros)
INSERT INTO OrdenProducto (uuid, orden_id, producto_id, cantidad, precio_unitario, descuento, subtotal, iva, total, notas) VALUES
('ordenprod-001', 1, 1, 2, 599, 0, 1198, 144, 1342, 'Con doble queso'),
('ordenprod-002', 2, 2, 1, 850, 0, 850, 102, 952, NULL),
('ordenprod-003', 3, 3, 1, 450, 0, 450, 54, 504, 'Sin crutones');

-- TipoPago (3 registros)
INSERT INTO TipoPago (uuid, nombre, activo) VALUES
('tipopago-001', 'EFECTIVO', 1),
('tipopago-002', 'TARJETA_DEBITO', 1),
('tipopago-003', 'TRANSFERENCIA', 1);

-- Pago (3 registros)
INSERT INTO Pago (uuid, orden_id, tipo_pago_id, monto, referencia, estado) VALUES
('pago-001', 1, 1, 1503, NULL, 'COMPLETADO'),
('pago-002', 2, 2, 1066, 'TXN-123456', 'COMPLETADO'),
('pago-003', 3, 3, 564, 'TRF-789012', 'PENDIENTE');

-- Factura (3 registros)
INSERT INTO Factura (uuid, numero_factura, clave_acceso, cliente_id, orden_id, fecha_emision, subtotal_0, subtotal_iva, subtotal, descuento, iva, total, estado_sri) VALUES
('factura-001', '001-001-000000001', '12345678901234567890123456789012345678901234567', 1, 1, datetime('now'), 0, 1342, 1342, 0, 161, 1503, 'PENDIENTE'),
('factura-002', '001-001-000000002', '12345678901234567890123456789012345678901234568', 2, 2, datetime('now'), 0, 952, 952, 0, 114, 1066, 'PENDIENTE'),
('factura-003', '001-001-000000003', '12345678901234567890123456789012345678901234569', 3, 3, datetime('now'), 0, 504, 504, 0, 60, 564, 'PENDIENTE');

-- Plan (3 registros)
INSERT INTO Plan (uuid, nombre, activo, perfil_negocio_id) VALUES
('plan-001', 'BASICO', 1, 1),
('plan-002', 'PREMIUM', 1, 2),
('plan-003', 'EMPRESARIAL', 1, 3);

-- Feature (3 registros)
INSERT INTO Feature (uuid, nombre, habilitado, perfil_negocio_id) VALUES
('feature-001', 'MODULO_FACTURACION', 1, 1),
('feature-002', 'DELIVERY', 1, 1),
('feature-003', 'REPORTES_AVANZADOS', 0, 1);

-- App Config
INSERT INTO app_config (clave, valor) VALUES
('environment', 'PRUEBAS'),
('db_version', '1'),
('last_sync', NULL);
