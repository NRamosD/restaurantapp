import * as SQLite from 'expo-sqlite';

export const dbConnection = SQLite.openDatabaseAsync('rest-app.db');

export const CreateDishesTable = async (dbConnection:SQLite.SQLiteDatabase) => {
    (await dbConnection).execAsync(`
        DROP TABLE IF EXISTS platos;

        CREATE TABLE IF NOT EXISTS platos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT NOT NULL UNIQUE,  -- ← clave única
        nombre TEXT NOT NULL,
        descripcion TEXT,
        precio REAL,
        categoria TEXT,
        subcategoria TEXT,
        imagenUrl TEXT,
        galeria TEXT,
        videoUrl TEXT,
        descuento REAL,
        precioAnterior REAL,
        envioGratis INTEGER,
        relacionados TEXT,
        fechaCreacion TEXT NOT NULL,
        fechaActualizacion TEXT,
        usuarioCreadorId INTEGER
        );

        INSERT INTO platos (
        uuid, nombre, descripcion, precio, categoria, subcategoria,
        imagenUrl, galeria, videoUrl, descuento, precioAnterior,
        envioGratis, relacionados, fechaCreacion, fechaActualizacion, usuarioCreadorId
        ) VALUES
        (
            'uuid-plato-001',
            'Hamburguesa Clásica',
            'Hamburguesa de res con queso cheddar, lechuga, tomate y salsa especial',
            8.99,
            'Comida Rápida',
            'Hamburguesas',
            'https://miapp.com/img/hamburguesa.jpg',
            '["https://miapp.com/img/hamburguesa1.jpg", "https://miapp.com/img/hamburguesa2.jpg"]',
            'https://miapp.com/video/hamburguesa.mp4',
            15,
            10.99,
            1,
            '[2, 3]',
            '2025-07-27T12:00:00Z',
            '2025-07-27T12:10:00Z',
            1
        ),
        (
            'uuid-plato-002',
            'Ensalada César',
            'Ensalada fresca con lechuga romana, pollo a la parrilla, crutones y aderezo césar',
            6.50,
            'Ensaladas',
            'Saludables',
            'https://miapp.com/img/ensalada.jpg',
            '["https://miapp.com/img/ensalada1.jpg"]',
            NULL,
            NULL,
            NULL,
            0,
            '[1]',
            '2025-07-27T13:00:00Z',
            NULL,
            2
        );




    `)
}