export interface SyncResponse {
  success: boolean;
  serverId?: number;
  message?: string;
  syncedAt?: string;
}

export interface SyncPayload {
  table: string;
  id: number;
  data: Record<string, unknown>;
}

export const mockSyncApi = async (payload: SyncPayload): Promise<SyncResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`[MOCK API] Sincronizando ${payload.table} - ID: ${payload.id}`);
      resolve({
        success: true,
        serverId: Date.now(),
        message: 'Sincronizado correctamente',
        syncedAt: new Date().toISOString(),
      });
    }, Math.random() * 800 + 200);
  });
};

export const mockSyncBatch = async (payloads: SyncPayload[]): Promise<SyncResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`[MOCK API] Sincronizando lote de ${payloads.length} registros`);
      resolve({
        success: true,
        serverId: Date.now(),
        message: `${payloads.length} registros sincronizados`,
        syncedAt: new Date().toISOString(),
      });
    }, Math.random() * 1500 + 500);
  });
};
