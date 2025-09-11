import * as SQLite from 'expo-sqlite';

// export const dbConnection = SQLite.openDatabaseAsync('rest-app.db');

export const CreateAllTablesTable = async (dbConnection:SQLite.SQLiteDatabase) => {
    await dbConnection.execAsync(`
        ${DeleteDataFromTables}
        ${CreateAllTables}
        ${InsertDefaultData}
    `)
}

const DeleteDataFromTables = `
    -- Disable foreign key checks
    PRAGMA foreign_keys = OFF;

    -- Delete data in reverse order of dependencies
    DELETE FROM Facturas;
    DELETE FROM Ordenes_Producto;
    DELETE FROM Ordenes;
    DELETE FROM Producto_Componentes;
    DELETE FROM Producto;
    DELETE FROM Componentes;
    DELETE FROM Perfil;

    -- Reset autoincrement counters
    DELETE FROM sqlite_sequence WHERE name IN ('Facturas', 'Ordenes_Producto', 'Ordenes', 'Producto_Componentes', 'Producto', 'Componentes', 'Perfil');

    -- Re-enable foreign key checks
    PRAGMA foreign_keys = ON;

`

const CreateAllTables = `    
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

`

const InsertDefaultData = `
    INSERT INTO Perfil (
        id_usuario, id_negocio, uuid, correo, telefono, 
        nombre_perfil, password_perfil, tipo_perfil, tipo_negocio, 
        estado, valores_configuraciones, auth
    ) VALUES (
        1, 
        1, 
        '550e8400-e29b-41d4-a716-446655440000', 
        'restaurante@ejemplo.com', 
        '1234567890', 
        'Restaurante Principal', 
        'hashed_password_123', 
        'admin', 
        'restaurante', 
        'activo', 
        '{"tema":"claro","moneda":"USD"}', 
        'auth_token_123'
    );

    INSERT INTO Componentes (
        id_perfil, uuid, nombre, descripcion, tipo, 
        material, peso, longitud, ancho, alto, 
        calorias, stock, porciones, color
    ) VALUES (
        1, 
        '550e8400-e29b-41d4-a716-446655440001', 
        'Pan de Hamburguesa', 
        'Pan fresco para hamburguesas', 
        'pan', 
        'harina', 
        0.2, 
        12.0, 
        12.0, 
        3.0, 
        250, 
        100, 
        1, 
        'dorado'
    );

    -- 3. Insert a product (Producto)
    INSERT INTO Producto (
        uuid, id_perfil, nombre, descripcion, imagen, 
        iva, precio, precio_total, stock, estado, 
        imagen_url, galeria, codigo_barras, slug, 
        descuento, precio_anterior, envio_gratis, tiempo_entrega
    ) VALUES (
        '550e8400-e29b-41d4-a716-446655440002',
        1,
        'Hamburguesa Clásica',
        'Deliciosa hamburguesa con queso, lechuga y tomate',
        'hamburguesa.jpg',
        0.12,
        5.99,
        6.71,
        50,
        'disponible',
        'https://ejemplo.com/img/hamburguesa.jpg',
        '["img1.jpg", "img2.jpg"]',
        '123456789012',
        'hamburguesa-clasica',
        0.00,
        6.99,
        1,
        '30-45 minutos'
    );

    -- 4. Insert product-component relationship (Producto_Componentes)
    INSERT INTO Producto_Componentes (
        id_producto, id_componente, uuid, cantidad
    ) VALUES (
        1,  -- ID del producto insertado anteriormente
        1,  -- ID del componente insertado anteriormente
        '550e8400-e29b-41d4-a716-446655440003',
        1
    );

    -- 5. Insert an order (Ordenes)
    INSERT INTO Ordenes (
        id_perfil, uuid, estado, total
    ) VALUES (
        1,
        '550e8400-e29b-41d4-a716-446655440004',
        'pendiente',
        13.42  -- 2 hamburguesas con IVA
    );

    -- 6. Insert order-product relationship (Ordenes_Producto)
    INSERT INTO Ordenes_Producto (
        id_orden, id_producto, uuid, cantidad, 
        precio_unitario, subtotal, detalle
    ) VALUES (
        1,  -- ID de la orden insertada
        1,  -- ID del producto
        '550e8400-e29b-41d4-a716-446655440005',
        2,  -- Cantidad
        5.99,  -- Precio unitario
        11.98,  -- Subtotal (5.99 * 2)
        'Sin cebolla, extra queso'
    );

    -- 7. Insert an invoice (Facturas)
    INSERT INTO Facturas (
        id_orden, uuid, valor_subtotal, valor_iva, 
        valor_total, fecha_emision, estado
    ) VALUES (
        1,  -- ID de la orden
        '550e8400-e29b-41d4-a716-446655440006',
        11.98,  -- Subtotal
        1.44,   -- IVA (12% de 11.98)
        13.42,  -- Total
        '2025-09-10 19:30:00',
        'pendiente'
    );

    -- 8. Insert audit record (Auditoria)
    INSERT INTO Auditoria (
        uuid, tabla_afectada, operacion, id_perfil, 
        cambio_anterior, detalle
    ) VALUES (
        '550e8400-e29b-41d4-a716-446655440007',
        'Producto',
        'INSERT',
        1,
        NULL,
        'Se creó un nuevo producto: Hamburguesa Clásica'
    );

`


// -- admin, cliente, etc.
// -- INSERT, UPDATE, DELETE
//-- pendiente, pagado, cancelado
// -- pagada, pendiente, anulada