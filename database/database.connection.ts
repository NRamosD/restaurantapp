import * as SQLite from 'expo-sqlite';

// export const dbConnection = SQLite.openDatabaseAsync('rest-app.db');

export const CreateAllTablesTable = async (dbConnection:SQLite.SQLiteDatabase) => {
    await dbConnection.execAsync(`
        PRAGMA foreign_keys = ON;
        CREATE TABLE IF NOT EXISTS Perfil (
            id_perfil INTEGER PRIMARY KEY AUTOINCREMENT,
            id_usuario INTEGER NOT NULL,
            id_negocio INTEGER,
            uuid TEXT NOT NULL UNIQUE,
            correo TEXT NOT NULL,
            telefono TEXT,
            nombre_perfil TEXT NOT NULL,
            password_perfil TEXT NOT NULL,
            tipo_perfil TEXT NOT NULL, 
            tipo_negocio TEXT,
            estado TEXT DEFAULT 'activo',
            valores_configuraciones TEXT NOT NULL,
            auth TEXT NOT NULL,
            fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
        );


        CREATE TABLE IF NOT EXISTS Producto (
            id_producto INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT NOT NULL UNIQUE,
            id_perfil INTEGER NOT NULL,
            nombre TEXT NOT NULL,
            descripcion TEXT,
            imagen TEXT,
            iva REAL,
            precio REAL NOT NULL,
            precio_total REAL NOT NULL,
            stock INTEGER DEFAULT 0,
            estado TEXT DEFAULT 'disponible',
            imagen_url TEXT,
            galeria TEXT,
            video_url TEXT,
            codigo_barras TEXT,
            slug TEXT,
            descuento REAL,
            precio_anterior REAL,
            envio_gratis INTEGER,
            tiempo_entrega TEXT,
            FOREIGN KEY (id_perfil) REFERENCES Perfil(id_perfil)
        );

        CREATE TABLE IF NOT EXISTS Componentes (
            id_componente INTEGER PRIMARY KEY AUTOINCREMENT,
            id_perfil INTEGER NOT NULL,
            uuid TEXT NOT NULL UNIQUE,
            nombre TEXT NOT NULL,
            descripcion TEXT,
            tipo TEXT,
            material TEXT,
            peso REAL,
            longitud REAL,
            ancho REAL,
            alto REAL,
            calorias INTEGER,
            stock INTEGER DEFAULT 0,
            porciones INTEGER,
            color TEXT,
            fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (id_perfil) REFERENCES Perfil(id_perfil)
        );

        CREATE TABLE IF NOT EXISTS Producto_Componentes (
            id_producto_componente INTEGER PRIMARY KEY AUTOINCREMENT,
            id_producto INTEGER NOT NULL,
            id_componente INTEGER NOT NULL,
            uuid TEXT NOT NULL UNIQUE,
            cantidad INTEGER DEFAULT 1,
            FOREIGN KEY (id_producto) REFERENCES Producto(id_producto),
            FOREIGN KEY (id_componente) REFERENCES Componentes(id_componente)
        );

        CREATE TABLE IF NOT EXISTS Ordenes (
            id_orden INTEGER PRIMARY KEY AUTOINCREMENT,
            id_perfil INTEGER NOT NULL,
            uuid TEXT NOT NULL UNIQUE,
            fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
            estado TEXT DEFAULT 'pendiente', 
            total REAL NOT NULL,
            FOREIGN KEY (id_perfil) REFERENCES Perfil(id_perfil)
        );

        CREATE TABLE IF NOT EXISTS Ordenes_Producto (
            id_orden_producto INTEGER PRIMARY KEY AUTOINCREMENT,
            id_orden INTEGER NOT NULL,
            id_producto INTEGER NOT NULL,
            uuid TEXT NOT NULL UNIQUE,
            cantidad INTEGER NOT NULL,
            precio_unitario REAL NOT NULL,
            subtotal REAL NOT NULL,
            detalle TEXT,
            FOREIGN KEY (id_orden) REFERENCES Ordenes(id_orden),
            FOREIGN KEY (id_producto) REFERENCES Producto(id_producto)
        );

        CREATE TABLE IF NOT EXISTS Facturas (
            id_factura INTEGER PRIMARY KEY AUTOINCREMENT,
            id_orden INTEGER NOT NULL,
            uuid TEXT NOT NULL UNIQUE,
            valor_subtotal REAL NOT NULL,
            valor_iva REAL,
            valor_total REAL NOT NULL,
            fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
            fecha_emision DATETIME,
            estado TEXT DEFAULT 'pendiente',
            FOREIGN KEY (id_orden) REFERENCES Ordenes(id_orden)
        );

        CREATE TABLE IF NOT EXISTS Auditoria (
            uuid TEXT PRIMARY KEY,
            tabla_afectada TEXT NOT NULL,
            operacion TEXT NOT NULL, 
            id_perfil INTEGER,
            cambio_anterior TEXT,
            fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
            detalle TEXT,
            FOREIGN KEY (id_perfil) REFERENCES Perfil(id_perfil)
        );


    `)
}



// DROP TABLE IF EXISTS platos;

//         CREATE TABLE IF NOT EXISTS IF NOT EXISTS platos (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         uuid TEXT NOT NULL UNIQUE,  -- ← clave única
//         nombre TEXT NOT NULL,
//         descripcion TEXT,
//         precio REAL,
//         categoria TEXT,
//         subcategoria TEXT,
//         imagenUrl TEXT,
//         galeria TEXT,
//         videoUrl TEXT,
//         descuento REAL,
//         precioAnterior REAL,
//         envioGratis INTEGER,
//         relacionados TEXT,
//         fechaCreacion TEXT NOT NULL,
//         fechaActualizacion TEXT,
//         usuarioCreadorId INTEGER
//         );

//         INSERT INTO platos (
//         uuid, nombre, descripcion, precio, categoria, subcategoria,
//         imagenUrl, galeria, videoUrl, descuento, precioAnterior,
//         envioGratis, relacionados, fechaCreacion, fechaActualizacion, usuarioCreadorId
//         ) VALUES
//         (
//             'uuid-plato-001',
//             'Hamburguesa Clásica',
//             'Hamburguesa de res con queso cheddar, lechuga, tomate y salsa especial',
//             8.99,
//             'Comida Rápida',
//             'Hamburguesas',
//             'https://miapp.com/img/hamburguesa.jpg',
//             '["https://miapp.com/img/hamburguesa1.jpg", "https://miapp.com/img/hamburguesa2.jpg"]',
//             'https://miapp.com/video/hamburguesa.mp4',
//             15,
//             10.99,
//             1,
//             '[2, 3]',
//             '2025-07-27T12:00:00Z',
//             '2025-07-27T12:10:00Z',
//             1
//         ),
//         (
//             'uuid-plato-002',
//             'Ensalada César',
//             'Ensalada fresca con lechuga romana, pollo a la parrilla, crutones y aderezo césar',
//             6.50,
//             'Ensaladas',
//             'Saludables',
//             'https://miapp.com/img/ensalada.jpg',
//             '["https://miapp.com/img/ensalada1.jpg"]',
//             NULL,
//             NULL,
//             NULL,
//             0,
//             '[1]',
//             '2025-07-27T13:00:00Z',
//             NULL,
//             2
//         );



// CREATE TABLE IF NOT EXISTS Usuarios (
//     id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
//     uuid TEXT NOT NULL UNIQUE,
//     nombre TEXT NOT NULL,
//     apellido TEXT,
//     email TEXT UNIQUE NOT NULL,
//     password_hash TEXT NOT NULL,
//     maximo_perfiles INTEGER DEFAULT 2,
//     estado TEXT DEFAULT 'activo',
//     telefono TEXT,
//     fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
// );
// -- =========================
// -- NEGOCIO
// -- =========================
// CREATE TABLE IF NOT EXISTS Categoria_negocio (
//     id_categoria INTEGER PRIMARY KEY AUTOINCREMENT,
//     id_usuario INTEGER NOT NULL,
//     uuid TEXT NOT NULL UNIQUE,
//     nombre TEXT NOT NULL,
//     descripcion TEXT,
//     estado TEXT DEFAULT 'activo',
//     fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario)
// );

// CREATE TABLE IF NOT EXISTS Negocio (
//     id_negocio INTEGER PRIMARY KEY AUTOINCREMENT,
//     id_usuario INTEGER NOT NULL,
//     uuid TEXT NOT NULL UNIQUE,
//     ruc TEXT,
//     nombre TEXT NOT NULL,
//     descripcion TEXT,
//     categoria TEXT,
//     direccion TEXT,
//     telefono TEXT,
//     estado TEXT DEFAULT 'activo',
//     fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario)
// );


// CREATE TABLE IF NOT EXISTS ConfiguracionesNegocio (
//     id_configuracion INTEGER PRIMARY KEY AUTOINCREMENT,
//     id_negocio INTEGER NOT NULL,
//     clave TEXT NOT NULL,
//     valor TEXT,
//     FOREIGN KEY (id_negocio) REFERENCES Negocio(id_negocio)
// );



// CREATE TABLE IF NOT EXISTS DatosPago (
//     id_pago INTEGER PRIMARY KEY AUTOINCREMENT,
//     id_factura INTEGER NOT NULL,
//     metodo_pago TEXT NOT NULL, -- tarjeta, paypal, etc.
//     referencia TEXT UNIQUE,
//     monto REAL NOT NULL,
//     fecha_pago DATETIME DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY (id_factura) REFERENCES Facturas(id_factura)
// );

// -- =========================
// -- PLANES
// -- =========================

// CREATE TABLE IF NOT EXISTS Planes (
//     id_plan INTEGER PRIMARY KEY AUTOINCREMENT,
//     nombre TEXT NOT NULL,
//     descripcion TEXT,
//     precio REAL NOT NULL,
//     duracion_dias INTEGER NOT NULL
// );

// CREATE TABLE IF NOT EXISTS Planes_Pagados (
//     id_plan_pagado INTEGER PRIMARY KEY AUTOINCREMENT,
//     id_perfil INTEGER NOT NULL,
//     id_plan INTEGER NOT NULL,
//     fecha_inicio DATETIME NOT NULL,
//     fecha_fin DATETIME NOT NULL,
//     estado TEXT DEFAULT 'activo', -- activo, expirado, cancelado
//     FOREIGN KEY (id_perfil) REFERENCES Perfil(id_perfil),
//     FOREIGN KEY (id_plan) REFERENCES Planes(id_plan)
// );

// -- =========================
// -- AUDITORÍA
// -- =========================

// -- admin, cliente, etc.
// -- INSERT, UPDATE, DELETE
//-- pendiente, pagado, cancelado
// -- pagada, pendiente, anulada