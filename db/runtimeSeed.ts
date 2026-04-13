import { eq } from 'drizzle-orm';
import type { DrizzleDb } from '@/db/db';
import {
  AppConfig,
  Cliente,
  Componente,
  Factura,
  Feature,
  Orden,
  OrdenProducto,
  Pago,
  PerfilNegocio,
  Permiso,
  Plan,
  Producto,
  ProductoComponente,
  Sesion,
  TipoPago,
  Usuario,
  UsuarioPermiso,
} from '@/db/schema';

const SEED_VERSION = '2026-04-13-runtime';

interface AppConfigEntry {
  clave: string;
  valor: string | null;
}

const perfiles = [
  {
    uuid: '2bb8178f-5112-4849-9a0b-9b12b2c33f01',
    nombreComercial: 'Restaurante El Palé',
    razonSocial: 'El Palé Restaurantes C.A.',
    ruc: '1234567890001',
    direccion: 'Av. Principal 123, Quito',
    telefono: '0991234567',
    email: 'elpale@restaurante.com',
    obligadoContabilidad: 1,
    regimenRimpe: 1,
    ambiente: 'PRUEBAS',
    secuenciaFacturaActual: 0,
    secuenciaOrdenActual: 1,
  },
  {
    uuid: '8f2be41b-4be8-470d-9fe6-860c9d088f02',
    nombreComercial: 'Pizzería Napoli',
    razonSocial: 'Napoli Food Services',
    ruc: '1234567890002',
    direccion: 'Av. Colon 456, Guayaquil',
    telefono: '0987654321',
    email: 'napoli@pizzeria.com',
    obligadoContabilidad: 1,
    regimenRimpe: 0,
    ambiente: 'PRUEBAS',
    secuenciaFacturaActual: 0,
    secuenciaOrdenActual: 1,
  },
  {
    uuid: 'f36f7f67-a38a-4ca4-b5db-f39d8eb7ea03',
    nombreComercial: 'Fast Food BurgerKing',
    razonSocial: 'BurgerKing Ecuador',
    ruc: '1234567890003',
    direccion: 'Av. Amazonas 789, Quito',
    telefono: '0976543210',
    email: 'burger@fastfood.com',
    obligadoContabilidad: 1,
    regimenRimpe: 1,
    ambiente: 'PRODUCCION',
    secuenciaFacturaActual: 100,
    secuenciaOrdenActual: 50,
  },
  {
    uuid: '0d29a950-ff2f-47f4-af8a-c9773fe4c204',
    nombreComercial: 'Café Aurora',
    razonSocial: 'Aurora Café Bistro S.A.',
    ruc: '1234567890004',
    direccion: 'Calle Loja 220, Cuenca',
    telefono: '0961112233',
    email: 'contacto@aurora.com',
    obligadoContabilidad: 1,
    regimenRimpe: 0,
    ambiente: 'PRUEBAS',
    secuenciaFacturaActual: 15,
    secuenciaOrdenActual: 8,
  },
  {
    uuid: '804ddf9a-f1f8-46e0-a827-b08b6cfc6005',
    nombreComercial: 'Sushi Nami',
    razonSocial: 'Nami Sushi Bar Cia. Ltda.',
    ruc: '1234567890005',
    direccion: 'Av. Ordoñez Lasso 98, Cuenca',
    telefono: '0952223344',
    email: 'hola@nami.com',
    obligadoContabilidad: 1,
    regimenRimpe: 1,
    ambiente: 'PRUEBAS',
    secuenciaFacturaActual: 20,
    secuenciaOrdenActual: 12,
  },
  {
    uuid: '62de8b11-4d58-4271-adfc-327dc8163606',
    nombreComercial: 'Tacos El Barrio',
    razonSocial: 'El Barrio Foods S.A.S.',
    ruc: '1234567890006',
    direccion: 'Malecón 300, Guayaquil',
    telefono: '0943334455',
    email: 'info@elbarrio.com',
    obligadoContabilidad: 0,
    regimenRimpe: 0,
    ambiente: 'PRUEBAS',
    secuenciaFacturaActual: 10,
    secuenciaOrdenActual: 6,
  },
] as const;

const usuarios = [
  {
    uuid: '7c1494a8-9df5-48ab-bd43-c4c213d8f101',
    nombre: 'Juan Administrator',
    email: 'juan@elpale.com',
    passwordHash: '$2b$10$D1ZAZJOsVNL70y3gNiQZ3.IkvswY.eoMsBL5OcD80vPZGzHGUGif.',
    rol: 'ADMIN',
    perfilNegocioUuid: perfiles[0].uuid,
  },
  {
    uuid: '7f67c6b5-b9ad-4d17-a685-f9dbdcbb9702',
    nombre: 'Maria Cajera',
    email: 'maria@elpale.com',
    passwordHash: '$2b$10$D1ZAZJOsVNL70y3gNiQZ3.IkvswY.eoMsBL5OcD80vPZGzHGUGif.',
    rol: 'CAJERO',
    perfilNegocioUuid: perfiles[0].uuid,
  },
  {
    uuid: '5fe15cbe-08a5-4832-862d-720655cc0403',
    nombre: 'Pedro Mesero',
    email: 'pedro@elpale.com',
    passwordHash: '$2b$10$D1ZAZJOsVNL70y3gNiQZ3.IkvswY.eoMsBL5OcD80vPZGzHGUGif.',
    rol: 'MESERO',
    perfilNegocioUuid: perfiles[0].uuid,
  },
  {
    uuid: '72d383ce-b4ec-4fd0-9677-eb1e93728504',
    nombre: 'Ana Barista',
    email: 'ana@aurora.com',
    passwordHash: '$2b$10$D1ZAZJOsVNL70y3gNiQZ3.IkvswY.eoMsBL5OcD80vPZGzHGUGif.',
    rol: 'CAJERO',
    perfilNegocioUuid: perfiles[3].uuid,
  },
  {
    uuid: '2521c96e-00cc-41bd-b369-1ef15a011d05',
    nombre: 'Kenji Sato',
    email: 'kenji@nami.com',
    passwordHash: '$2b$10$D1ZAZJOsVNL70y3gNiQZ3.IkvswY.eoMsBL5OcD80vPZGzHGUGif.',
    rol: 'ADMIN',
    perfilNegocioUuid: perfiles[4].uuid,
  },
  {
    uuid: '3223a6e8-5e27-4a85-af48-c7f52a3d3006',
    nombre: 'Luis Parrales',
    email: 'luis@elbarrio.com',
    passwordHash: '$2b$10$D1ZAZJOsVNL70y3gNiQZ3.IkvswY.eoMsBL5OcD80vPZGzHGUGif.',
    rol: 'MESERO',
    perfilNegocioUuid: perfiles[5].uuid,
  },
] as const;

const sesiones = [
  { uuid: 'd8da727d-9a14-43f4-88fe-df18e7e29101', usuarioUuid: usuarios[0].uuid, token: 'token-juan-001', expiraEn: '2099-12-31T23:59:59.000Z', activo: 1 },
  { uuid: '24ff91c6-9a07-472c-ae98-b603b5b49902', usuarioUuid: usuarios[1].uuid, token: 'token-maria-001', expiraEn: '2099-12-31T23:59:59.000Z', activo: 1 },
  { uuid: '084bf4ed-2dd4-49b6-a339-efbe32fb8403', usuarioUuid: usuarios[2].uuid, token: 'token-pedro-001', expiraEn: '2099-12-31T23:59:59.000Z', activo: 1 },
  { uuid: 'd1c603da-660d-4fd4-9c79-18a95e949204', usuarioUuid: usuarios[3].uuid, token: 'token-ana-001', expiraEn: '2099-12-31T23:59:59.000Z', activo: 1 },
  { uuid: '7ac445cd-c22b-440e-8d4e-d3d4f7efa905', usuarioUuid: usuarios[4].uuid, token: 'token-kenji-001', expiraEn: '2099-12-31T23:59:59.000Z', activo: 1 },
  { uuid: '6937f112-25a4-4360-90c3-d1cb80576a06', usuarioUuid: usuarios[5].uuid, token: 'token-luis-001', expiraEn: '2099-12-31T23:59:59.000Z', activo: 1 },
] as const;

const permisos = [
  { uuid: '65ac847b-13ef-4dfc-a0b6-228119431301', nombre: 'CREAR_ORDEN', descripcion: 'Permite crear nuevas ordenes' },
  { uuid: '14755572-e298-4a33-abdd-1f78a374fb02', nombre: 'VER_REPORTES', descripcion: 'Permite ver reportes del negocio' },
  { uuid: '4f3ec11f-421e-41b7-a470-c76d9a9bcf03', nombre: 'FACTURAR', descripcion: 'Permite generar facturas electronicas' },
  { uuid: '6324ab1d-223b-4252-bddf-0a2961d4f704', nombre: 'GESTIONAR_PRODUCTOS', descripcion: 'Permite agregar/modificar productos' },
  { uuid: '1aff8fb4-56dd-47b2-aa08-9b7f8798c505', nombre: 'GESTIONAR_USUARIOS', descripcion: 'Permite administrar usuarios del sistema' },
  { uuid: 'a2d4f44d-2110-47b8-8dbe-9f12e0dcf206', nombre: 'GESTIONAR_CLIENTES', descripcion: 'Permite crear y editar clientes' },
  { uuid: '4f885ab6-7aea-476f-a772-01adb74df707', nombre: 'VER_INVENTARIO', descripcion: 'Permite consultar stock e insumos' },
  { uuid: 'a568f577-0ec5-4167-b7a1-05c22774bf08', nombre: 'ANULAR_FACTURA', descripcion: 'Permite anular comprobantes' },
] as const;

const usuarioPermisos = [
  { uuid: '94d744f7-d5a4-45b8-a5d7-89fb08689f01', usuarioUuid: usuarios[0].uuid, permisoUuid: permisos[0].uuid },
  { uuid: '5393a8ed-4c2d-4b22-abd2-1d4295fba302', usuarioUuid: usuarios[0].uuid, permisoUuid: permisos[1].uuid },
  { uuid: '40ad1801-2151-4fc1-b902-96b27089bb03', usuarioUuid: usuarios[0].uuid, permisoUuid: permisos[2].uuid },
  { uuid: '6d287719-47e3-4161-bbf4-f4bd3fe1ad04', usuarioUuid: usuarios[1].uuid, permisoUuid: permisos[0].uuid },
  { uuid: 'c4163b5c-fce3-4d4b-ab66-57b8cf4ac505', usuarioUuid: usuarios[3].uuid, permisoUuid: permisos[5].uuid },
  { uuid: 'd30ebfca-89a4-4fe1-9a67-b08df6953406', usuarioUuid: usuarios[4].uuid, permisoUuid: permisos[3].uuid },
] as const;

const clientes = [
  { uuid: '7711f261-e1aa-4308-9b32-f4b1c420a401', nombre: 'Carlos Rodriguez', tipoIdentificacion: 'CEDULA', identificacion: '1712345678', direccion: 'Av. Eloy Alfaro 123', telefono: '0991112233', email: 'carlos@email.com' },
  { uuid: '2a3ee34f-7e2d-4be2-99be-334f046e6902', nombre: 'Maria Garcia', tipoIdentificacion: 'RUC', identificacion: '1234567890001', direccion: 'Av. Republica 456', telefono: '0994445566', email: 'maria@empresa.com' },
  { uuid: 'cfbf5d4a-4ed3-4131-9b79-f540b5006b03', nombre: 'Consumidor Final', tipoIdentificacion: 'CONSUMIDOR_FINAL', identificacion: '9999999999', direccion: 'N/A', telefono: '0000000000', email: null },
  { uuid: '78cb6028-ac38-4e76-9548-c4d352d47d04', nombre: 'Andrea Mena', tipoIdentificacion: 'CEDULA', identificacion: '1723456789', direccion: 'Av. Solano 100', telefono: '0981122334', email: 'andrea@email.com' },
  { uuid: '60ae51be-fc8d-459f-96a7-446fb9f13d05', nombre: 'Comercial Ortiz', tipoIdentificacion: 'RUC', identificacion: '1790011223001', direccion: 'Parque Industrial Norte', telefono: '0972211334', email: 'compras@ortiz.com' },
  { uuid: '39f483eb-2d60-488b-8f9a-8ce555d23506', nombre: 'Diego Paredes', tipoIdentificacion: 'PASAPORTE', identificacion: 'AB1234567', direccion: 'La Carolina', telefono: '0963344556', email: 'diego@correo.com' },
] as const;

const productos = [
  { uuid: '280c5928-d65a-437e-9f42-93c60c245201', nombre: 'Hamburguesa Clasica', descripcion: 'Hamburguesa con queso, lechuga y tomate', precio: 599, aplicaIva: 1, porcentajeIva: 12, stock: 50, ilimitado: 0, imagenUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd', estado: 'DISPONIBLE', perfilNegocioUuid: perfiles[0].uuid },
  { uuid: 'd887b3bf-d0f8-45a3-935c-d6e2eaf80502', nombre: 'Pizza Margarita', descripcion: 'Pizza con salsa de tomate, mozzarella y albahaca', precio: 850, aplicaIva: 1, porcentajeIva: 12, stock: 30, ilimitado: 0, imagenUrl: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3', estado: 'DISPONIBLE', perfilNegocioUuid: perfiles[0].uuid },
  { uuid: '8adf9498-f4b7-4f5a-928a-27f11a6ec303', nombre: 'Ensalada Caesar', descripcion: 'Ensalada con pollo, crutones y aderezo cesar', precio: 450, aplicaIva: 1, porcentajeIva: 12, stock: 20, ilimitado: 0, imagenUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1', estado: 'DISPONIBLE', perfilNegocioUuid: perfiles[0].uuid },
  { uuid: 'e4c9cb30-fddd-43fe-982e-4c665fefb504', nombre: 'Cappuccino Grande', descripcion: 'Cafe espresso con leche vaporizada', precio: 375, aplicaIva: 1, porcentajeIva: 12, stock: 100, ilimitado: 1, imagenUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93', estado: 'DISPONIBLE', perfilNegocioUuid: perfiles[3].uuid },
  { uuid: '5e35dca7-5455-4c1d-84a7-6cb245e73d05', nombre: 'Sushi Roll Salmon', descripcion: 'Roll de salmon con aguacate y queso crema', precio: 1299, aplicaIva: 1, porcentajeIva: 12, stock: 25, ilimitado: 0, imagenUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c', estado: 'DISPONIBLE', perfilNegocioUuid: perfiles[4].uuid },
  { uuid: 'b48df2fa-cb9e-4e16-8523-a272dc687906', nombre: 'Taco al Pastor', descripcion: 'Taco de cerdo adobado con pina y cebolla', precio: 299, aplicaIva: 1, porcentajeIva: 12, stock: 80, ilimitado: 0, imagenUrl: 'https://images.unsplash.com/photo-1613514785940-daed07799d9b', estado: 'DISPONIBLE', perfilNegocioUuid: perfiles[5].uuid },
] as const;

const componentes = [
  { uuid: '2aa0e953-56a9-49ee-81e3-788d32c8b301', nombre: 'Pan de Hamburguesa', unidadMedida: 'unidad', stockActual: 100, stockMinimo: 20, costoUnitario: 50, perfilNegocioUuid: perfiles[0].uuid },
  { uuid: 'd3134b50-361d-4f19-9441-9f12d7848602', nombre: 'Carne de Res', unidadMedida: 'kg', stockActual: 25, stockMinimo: 5, costoUnitario: 1200, perfilNegocioUuid: perfiles[0].uuid },
  { uuid: '85df5297-879f-4e0e-9172-f69d46ab4f03', nombre: 'Queso Cheddar', unidadMedida: 'kg', stockActual: 10, stockMinimo: 2, costoUnitario: 800, perfilNegocioUuid: perfiles[0].uuid },
  { uuid: 'b92efa2f-3784-43f3-9ad7-f2f0ff368504', nombre: 'Cafe Molido', unidadMedida: 'kg', stockActual: 15, stockMinimo: 3, costoUnitario: 1800, perfilNegocioUuid: perfiles[3].uuid },
  { uuid: '0f9ad88d-3d20-4230-995f-9ed195cb9705', nombre: 'Salmon Fresco', unidadMedida: 'kg', stockActual: 12, stockMinimo: 2, costoUnitario: 3200, perfilNegocioUuid: perfiles[4].uuid },
  { uuid: '3954f976-ef11-4630-8897-eb77d754f006', nombre: 'Tortilla de Maiz', unidadMedida: 'unidad', stockActual: 300, stockMinimo: 50, costoUnitario: 20, perfilNegocioUuid: perfiles[5].uuid },
] as const;

const productoComponentes = [
  { uuid: '5a7cf9cd-8ef9-4149-9558-cd72606c2401', productoUuid: productos[0].uuid, componenteUuid: componentes[0].uuid, cantidad: 1 },
  { uuid: '8e65db3b-5f98-417d-9e3d-a9ecf9669c02', productoUuid: productos[0].uuid, componenteUuid: componentes[1].uuid, cantidad: 0.2 },
  { uuid: 'f89d1123-e172-4545-8ee3-c44c2786b103', productoUuid: productos[0].uuid, componenteUuid: componentes[2].uuid, cantidad: 0.05 },
  { uuid: 'c0c8755e-50ce-4a59-a2aa-14f0d762d904', productoUuid: productos[3].uuid, componenteUuid: componentes[3].uuid, cantidad: 0.03 },
  { uuid: '1305ae6a-457e-451f-91af-281934d39c05', productoUuid: productos[4].uuid, componenteUuid: componentes[4].uuid, cantidad: 0.18 },
  { uuid: '67e11f8e-0d26-468d-8276-fa8f47245606', productoUuid: productos[5].uuid, componenteUuid: componentes[5].uuid, cantidad: 2 },
] as const;

const ordenes = [
  { uuid: '22e1adfd-4adb-4f3d-abd1-0d46f6af1b01', numeroOrden: 1, clienteUuid: clientes[0].uuid, usuarioUuid: usuarios[0].uuid, tipo: 'LOCAL', estado: 'PENDIENTE', subtotal: 1342, iva: 161, total: 1503, observaciones: 'Sin cebolla' },
  { uuid: 'd03efca7-aaf5-46a2-9fcb-f84ea3346e02', numeroOrden: 2, clienteUuid: clientes[1].uuid, usuarioUuid: usuarios[1].uuid, tipo: 'LLEVAR', estado: 'EN_PREPARACION', subtotal: 952, iva: 114, total: 1066, observaciones: null },
  { uuid: '4c5f4bc1-f8ea-42a2-8949-ef6c1cd56c03', numeroOrden: 3, clienteUuid: clientes[2].uuid, usuarioUuid: usuarios[2].uuid, tipo: 'DELIVERY', estado: 'LISTO', subtotal: 504, iva: 60, total: 564, observaciones: 'Urgente' },
  { uuid: '5784eb1e-a565-4fd6-b41b-cb0a531ac804', numeroOrden: 4, clienteUuid: clientes[3].uuid, usuarioUuid: usuarios[3].uuid, tipo: 'LOCAL', estado: 'PENDIENTE', subtotal: 375, iva: 45, total: 420, observaciones: 'Poco azucar' },
  { uuid: '57dd68b4-9ae1-452c-8735-84f1043a8e05', numeroOrden: 5, clienteUuid: clientes[4].uuid, usuarioUuid: usuarios[4].uuid, tipo: 'LLEVAR', estado: 'PENDIENTE', subtotal: 1299, iva: 156, total: 1455, observaciones: 'Sin ajonjoli' },
  { uuid: 'd82494b6-db6f-40aa-b76d-86e4738a9f06', numeroOrden: 6, clienteUuid: clientes[5].uuid, usuarioUuid: usuarios[5].uuid, tipo: 'DELIVERY', estado: 'EN_PREPARACION', subtotal: 598, iva: 72, total: 670, observaciones: 'Agregar salsa verde' },
] as const;

const ordenProductos = [
  { uuid: '5a6dfd2d-cf13-4561-a17b-fcfec947bc01', ordenUuid: ordenes[0].uuid, productoUuid: productos[0].uuid, cantidad: 2, precioUnitario: 599, descuento: 0, subtotal: 1198, iva: 144, total: 1342, notas: 'Con doble queso' },
  { uuid: 'a0a3fded-5a4d-44bf-809b-2d889bf44002', ordenUuid: ordenes[1].uuid, productoUuid: productos[1].uuid, cantidad: 1, precioUnitario: 850, descuento: 0, subtotal: 850, iva: 102, total: 952, notas: null },
  { uuid: 'edffcdd9-f7b7-4e4c-8313-d865b9231303', ordenUuid: ordenes[2].uuid, productoUuid: productos[2].uuid, cantidad: 1, precioUnitario: 450, descuento: 0, subtotal: 450, iva: 54, total: 504, notas: 'Sin crutones' },
  { uuid: '7968c943-f678-4eb7-b454-914c56320804', ordenUuid: ordenes[3].uuid, productoUuid: productos[3].uuid, cantidad: 1, precioUnitario: 375, descuento: 0, subtotal: 375, iva: 45, total: 420, notas: 'Con leche deslactosada' },
  { uuid: '2496409f-69d6-4a73-b638-f2774c9d7a05', ordenUuid: ordenes[4].uuid, productoUuid: productos[4].uuid, cantidad: 1, precioUnitario: 1299, descuento: 0, subtotal: 1299, iva: 156, total: 1455, notas: 'Sin ajonjoli' },
  { uuid: 'e1c3b0f3-fd4c-4ffb-9c34-4d917b75fc06', ordenUuid: ordenes[5].uuid, productoUuid: productos[5].uuid, cantidad: 2, precioUnitario: 299, descuento: 0, subtotal: 598, iva: 72, total: 670, notas: 'Agregar pinia' },
] as const;

const tiposPago = [
  { uuid: '7619c17f-406b-4d3c-b554-4daf8bf4d501', nombre: 'EFECTIVO', activo: 1 },
  { uuid: 'e6f20e03-2154-454b-a57b-7ca7ee633b02', nombre: 'TARJETA_DEBITO', activo: 1 },
  { uuid: 'd40cc4ef-fd70-4dc6-bec6-157bec826203', nombre: 'TRANSFERENCIA', activo: 1 },
  { uuid: '182a4b4c-47cf-4497-8301-729127c0eb04', nombre: 'TARJETA_CREDITO', activo: 1 },
  { uuid: '4d6640ef-a578-4fc2-a667-1dd3fd58eb05', nombre: 'PAGO_MOVIL', activo: 1 },
  { uuid: '97098af4-778e-4e56-8472-fbe1610eb706', nombre: 'QR', activo: 1 },
] as const;

const facturas = [
  { uuid: '034e77d0-39cb-4794-a582-69b6d98c4601', numeroFactura: '001-001-000000001', claveAcceso: '12345678901234567890123456789012345678901234567', clienteUuid: clientes[0].uuid, ordenUuid: ordenes[0].uuid, fechaEmision: '2026-04-13T12:00:00.000Z', subtotal0: 0, subtotalIva: 1342, subtotal: 1342, descuento: 0, iva: 161, total: 1503, estadoSri: 'PENDIENTE' },
  { uuid: '29a49a6a-c4ef-48ce-b308-0ac1c6933102', numeroFactura: '001-001-000000002', claveAcceso: '12345678901234567890123456789012345678901234568', clienteUuid: clientes[1].uuid, ordenUuid: ordenes[1].uuid, fechaEmision: '2026-04-13T12:01:00.000Z', subtotal0: 0, subtotalIva: 952, subtotal: 952, descuento: 0, iva: 114, total: 1066, estadoSri: 'PENDIENTE' },
  { uuid: 'e9fd4131-5fc6-48ef-907d-21f96ee99603', numeroFactura: '001-001-000000003', claveAcceso: '12345678901234567890123456789012345678901234569', clienteUuid: clientes[2].uuid, ordenUuid: ordenes[2].uuid, fechaEmision: '2026-04-13T12:02:00.000Z', subtotal0: 0, subtotalIva: 504, subtotal: 504, descuento: 0, iva: 60, total: 564, estadoSri: 'PENDIENTE' },
  { uuid: '3a34f633-02d1-4cc7-80f9-412bb0f19e04', numeroFactura: '001-001-000000004', claveAcceso: '12345678901234567890123456789012345678901234570', clienteUuid: clientes[3].uuid, ordenUuid: ordenes[3].uuid, fechaEmision: '2026-04-13T12:03:00.000Z', subtotal0: 0, subtotalIva: 375, subtotal: 375, descuento: 0, iva: 45, total: 420, estadoSri: 'PENDIENTE' },
  { uuid: '6b31bb6f-7d63-458b-a5c7-a61d2ad9e105', numeroFactura: '001-001-000000005', claveAcceso: '12345678901234567890123456789012345678901234571', clienteUuid: clientes[4].uuid, ordenUuid: ordenes[4].uuid, fechaEmision: '2026-04-13T12:04:00.000Z', subtotal0: 0, subtotalIva: 1299, subtotal: 1299, descuento: 0, iva: 156, total: 1455, estadoSri: 'PENDIENTE' },
  { uuid: '0d1dfe12-e5d0-4cdd-aa33-77fe6527f506', numeroFactura: '001-001-000000006', claveAcceso: '12345678901234567890123456789012345678901234572', clienteUuid: clientes[5].uuid, ordenUuid: ordenes[5].uuid, fechaEmision: '2026-04-13T12:05:00.000Z', subtotal0: 0, subtotalIva: 598, subtotal: 598, descuento: 0, iva: 72, total: 670, estadoSri: 'PENDIENTE' },
] as const;

const pagos = [
  { uuid: 'a3284b99-dd17-4b7f-9589-d2a215236301', ordenUuid: ordenes[0].uuid, facturaUuid: facturas[0].uuid, tipoPagoUuid: tiposPago[0].uuid, monto: 1503, referencia: null, estado: 'COMPLETADO' },
  { uuid: '0b4d4348-35dc-4cf7-9bd6-c57b82964902', ordenUuid: ordenes[1].uuid, facturaUuid: facturas[1].uuid, tipoPagoUuid: tiposPago[1].uuid, monto: 1066, referencia: 'TXN-123456', estado: 'COMPLETADO' },
  { uuid: '8c8dccdc-59da-43af-b728-17ce84d5f003', ordenUuid: ordenes[2].uuid, facturaUuid: facturas[2].uuid, tipoPagoUuid: tiposPago[2].uuid, monto: 564, referencia: 'TRF-789012', estado: 'PENDIENTE' },
  { uuid: 'a2031232-dcc8-4b57-9bd7-d0e5f3c94f04', ordenUuid: ordenes[3].uuid, facturaUuid: facturas[3].uuid, tipoPagoUuid: tiposPago[3].uuid, monto: 420, referencia: 'CC-445566', estado: 'COMPLETADO' },
  { uuid: '76889a4f-fd53-4480-b3f9-f9ab53f4b205', ordenUuid: ordenes[4].uuid, facturaUuid: facturas[4].uuid, tipoPagoUuid: tiposPago[4].uuid, monto: 1455, referencia: 'PM-998877', estado: 'COMPLETADO' },
  { uuid: '1decc03a-4593-4d11-9614-a3a782032506', ordenUuid: ordenes[5].uuid, facturaUuid: facturas[5].uuid, tipoPagoUuid: tiposPago[5].uuid, monto: 670, referencia: 'QR-112233', estado: 'PENDIENTE' },
] as const;

const planes = [
  { uuid: '04be969e-0133-4dfb-b348-0af00d869401', nombre: 'BASICO', activo: 1, perfilNegocioUuid: perfiles[0].uuid },
  { uuid: '65f8e72b-6201-4f66-96d7-f693dc4ce302', nombre: 'PREMIUM', activo: 1, perfilNegocioUuid: perfiles[1].uuid },
  { uuid: 'fce15a2f-27df-4bf7-a96b-b7e063885403', nombre: 'EMPRESARIAL', activo: 1, perfilNegocioUuid: perfiles[2].uuid },
  { uuid: 'a19c9c3c-df57-4d95-9bdb-a2324ded8b04', nombre: 'BASICO_PLUS', activo: 1, perfilNegocioUuid: perfiles[3].uuid },
  { uuid: '8a87b67f-e7fb-4893-ac36-f557e63ea705', nombre: 'PREMIUM_PLUS', activo: 1, perfilNegocioUuid: perfiles[4].uuid },
  { uuid: '4bf1e3e6-05db-4315-b91b-6ef29630ff06', nombre: 'STARTER', activo: 1, perfilNegocioUuid: perfiles[5].uuid },
] as const;

const features = [
  { uuid: 'aeaf90d7-ceb4-4f44-892a-91b637ec8701', nombre: 'MODULO_FACTURACION', habilitado: 1, perfilNegocioUuid: perfiles[0].uuid },
  { uuid: 'bd6e39d9-2f88-4dae-8830-44d459ce9002', nombre: 'DELIVERY', habilitado: 1, perfilNegocioUuid: perfiles[0].uuid },
  { uuid: 'ec83daa1-8846-4269-aed2-4c7d6ddf3003', nombre: 'REPORTES_AVANZADOS', habilitado: 0, perfilNegocioUuid: perfiles[0].uuid },
  { uuid: '40d8aa6f-112a-4ddc-967d-7db21e8d7304', nombre: 'MODULO_CAFETERIA', habilitado: 1, perfilNegocioUuid: perfiles[3].uuid },
  { uuid: 'af719a32-b4a3-479c-a59d-c6cecc9cfd05', nombre: 'INVENTARIO_SUSHI', habilitado: 1, perfilNegocioUuid: perfiles[4].uuid },
  { uuid: '2b0c8952-63d9-4f55-bf5b-77120282ca06', nombre: 'PROMOCIONES_TAKEOUT', habilitado: 1, perfilNegocioUuid: perfiles[5].uuid },
] as const;

async function insertIfNeeded<T extends { uuid: string }>(
  db: DrizzleDb,
  table: any,
  values: readonly T[]
) {
  for (const value of values) {
    await db.insert(table).values(value).onConflictDoNothing();
  }
}

async function upsertAppConfig(db: DrizzleDb, entry: AppConfigEntry) {
  await db.insert(AppConfig).values(entry).onConflictDoUpdate({
    target: AppConfig.clave,
    set: { valor: entry.valor },
  });
}

export async function seedDatabaseIfNeeded(db: DrizzleDb) {
  const existingSeedVersion = await db.query.AppConfig.findFirst({
    where: eq(AppConfig.clave, 'seed_version'),
  });

  if (existingSeedVersion?.valor === SEED_VERSION) {
    console.log('[DB SEED] Seed ya aplicado', { seedVersion: SEED_VERSION });
    return;
  }

  console.log('[DB SEED] Iniciando seed runtime', { seedVersion: SEED_VERSION });

  await insertIfNeeded(db, PerfilNegocio, perfiles);
  await insertIfNeeded(db, Usuario, usuarios);
  await insertIfNeeded(db, Sesion, sesiones);
  await insertIfNeeded(db, Permiso, permisos);
  await insertIfNeeded(db, UsuarioPermiso, usuarioPermisos);
  await insertIfNeeded(db, Cliente, clientes);
  await insertIfNeeded(db, Producto, productos);
  await insertIfNeeded(db, Componente, componentes);
  await insertIfNeeded(db, ProductoComponente, productoComponentes);
  await insertIfNeeded(db, Orden, ordenes);
  await insertIfNeeded(db, OrdenProducto, ordenProductos);
  await insertIfNeeded(db, TipoPago, tiposPago);
  await insertIfNeeded(db, Factura, facturas);
  await insertIfNeeded(db, Pago, pagos);
  await insertIfNeeded(db, Plan, planes);
  await insertIfNeeded(db, Feature, features);

  await upsertAppConfig(db, { clave: 'environment', valor: 'PRUEBAS' });
  await upsertAppConfig(db, { clave: 'db_version', valor: '1' });
  await upsertAppConfig(db, { clave: 'last_sync', valor: null });
  await upsertAppConfig(db, { clave: 'default_profile_uuid', valor: perfiles[0].uuid });
  await upsertAppConfig(db, { clave: 'default_currency', valor: 'USD' });
  await upsertAppConfig(db, { clave: 'seed_version', valor: SEED_VERSION });

  console.log('[DB SEED] Seed runtime aplicado correctamente', { seedVersion: SEED_VERSION });
}
