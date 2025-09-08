import { uuid } from "@/assets/utils/uuid";
import { Factura } from "@/interfaces/bill";
import * as SQLite from 'expo-sqlite';

// Crear una nueva factura
export const createBill = async (
    dbConnection: SQLite.SQLiteDatabase,
    factura: Omit<Factura, 'id_factura' | 'uuid' | 'fecha_creacion'>
): Promise<number> => {
    const result = await dbConnection.runAsync(
        `INSERT INTO Factura (
            id_orden, uuid, valor_subtotal, valor_iva, 
            valor_total, fecha_creacion, fecha_emision, estado
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            factura.id_orden,
            uuid(),
            factura.valor_subtotal,
            factura.valor_iva ?? null,
            factura.valor_total,
            new Date().toISOString(),
            factura.fecha_emision ?? null,
            factura.estado ?? 'pendiente'
        ]
    );
    return result.lastInsertRowId as number;
};

// Obtener factura por ID
export const getBillById = async (
    db: SQLite.SQLiteDatabase,
    id_factura: number
): Promise<Factura | null> => {
    const result = await db.getFirstAsync<Factura>(
        `SELECT * FROM Factura WHERE id_factura = ?`,
        [id_factura]
    );
    return result ?? null;
};

// Obtener factura por UUID
export const getBillByUuid = async (
    db: SQLite.SQLiteDatabase,
    uuid: string
): Promise<Factura | null> => {
    const result = await db.getFirstAsync<Factura>(
        `SELECT * FROM Factura WHERE uuid = ?`,
        [uuid]
    );
    return result ?? null;
};

// Obtener facturas por orden
export const getBillsByOrderId = async (
    db: SQLite.SQLiteDatabase,
    id_orden: number
): Promise<Factura[]> => {
    const results = await db.getAllAsync<Factura>(
        `SELECT * FROM Factura 
         WHERE id_orden = ? 
         ORDER BY fecha_creacion DESC`,
        [id_orden]
    );
    return results;
};

// Actualizar factura
export const updateBill = async (
    db: SQLite.SQLiteDatabase,
    factura: Factura
) => {
    if (!factura.id_factura) {
        throw new Error("❌ La factura debe tener un id_factura para actualizar");
    }

    await db.runAsync(
        `UPDATE Factura SET
            valor_subtotal = ?,
            valor_iva = ?,
            valor_total = ?,
            fecha_emision = ?,
            estado = ?
        WHERE id_factura = ?`,
        [
            factura.valor_subtotal,
            factura.valor_iva ?? null,
            factura.valor_total,
            factura.fecha_emision ?? null,
            factura.estado ?? 'pendiente',
            factura.id_factura
        ]
    );
};

// Actualizar estado de factura
export const updateBillStatus = async (
    db: SQLite.SQLiteDatabase,
    id_factura: number,
    estado: "pagada" | "pendiente" | "anulada"
) => {
    await db.runAsync(
        `UPDATE Factura SET
            estado = ?,
            fecha_emision = CASE 
                WHEN ? = 'pagada' AND fecha_emision IS NULL THEN CURRENT_TIMESTAMP
                ELSE fecha_emision
            END
        WHERE id_factura = ?`,
        [estado, estado, id_factura]
    );
};

// Eliminar factura
export const deleteBill = async (
    db: SQLite.SQLiteDatabase,
    id_factura: number
) => {
    await db.runAsync(
        "DELETE FROM Factura WHERE id_factura = ?",
        [id_factura]
    );
};

// Obtener facturas por estado
export const getBillsByStatus = async (
    db: SQLite.SQLiteDatabase,
    estado: "pagada" | "pendiente" | "anulada",
    limit: number = 100,
    offset: number = 0
): Promise<Factura[]> => {
    const results = await db.getAllAsync<Factura>(
        `SELECT * FROM Factura 
         WHERE estado = ? 
         ORDER BY fecha_creacion DESC
         LIMIT ? OFFSET ?`,
        [estado, limit, offset]
    );
    return results;
};

// Obtener estadísticas de facturación
export const getBillingStatistics = async (
    db: SQLite.SQLiteDatabase,
    startDate?: string,
    endDate?: string
): Promise<{
    totalFacturado: number;
    totalIva: number;
    cantidadFacturas: number;
    facturasPorEstado: Record<string, number>;
    facturacionMensual: Array<{ mes: string; total: number }>;
}> => {
    const dateFilter = startDate && endDate 
        ? "WHERE fecha_creacion BETWEEN ? AND ?" 
        : "";

    const params = startDate && endDate ? [startDate, endDate] : [];

    const [totals, status, monthly] = await Promise.all([
        db.getFirstAsync<{ 
            total: number; 
            iva: number; 
            count: number 
        }>(
            `SELECT 
                COALESCE(SUM(valor_total), 0) as total,
                COALESCE(SUM(COALESCE(valor_iva, 0)), 0) as iva,
                COUNT(*) as count
             FROM Factura
             ${dateFilter}`,
            params
        ),
        db.getAllAsync<{ estado: string; count: number }>(
            `SELECT 
                estado, 
                COUNT(*) as count 
             FROM Factura
             ${dateFilter}
             GROUP BY estado`,
            params
        ),
        db.getAllAsync<{ mes: string; total: number }>(
            `SELECT 
                strftime('%Y-%m', fecha_creacion) as mes,
                SUM(valor_total) as total
             FROM Factura
             ${dateFilter}
             GROUP BY strftime('%Y-%m', fecha_creacion)
             ORDER BY mes DESC
             LIMIT 12`,
            params
        )
    ]);

    const facturasPorEstado: Record<string, number> = {};
    status.forEach(s => {
        facturasPorEstado[s.estado] = s.count;
    });

    return {
        totalFacturado: totals?.total ?? 0,
        totalIva: totals?.iva ?? 0,
        cantidadFacturas: totals?.count ?? 0,
        facturasPorEstado,
        facturacionMensual: monthly
    };
};