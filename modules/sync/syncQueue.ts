import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SyncQueueItem {
  id: string;
  table: string;
  recordId: number;
  operation: 'CREATE' | 'UPDATE' | 'DELETE';
  data: Record<string, unknown>;
  createdAt: string;
  retryCount: number;
}

const SYNC_QUEUE_KEY = '@sync_queue';

export const syncQueue = {
  async add(item: Omit<SyncQueueItem, 'id' | 'createdAt' | 'retryCount'>): Promise<void> {
    const queue = await this.getAll();
    const newItem: SyncQueueItem = {
      ...item,
      id: `${item.table}_${item.recordId}_${Date.now()}`,
      createdAt: new Date().toISOString(),
      retryCount: 0,
    };
    queue.push(newItem);
    await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
  },

  async getAll(): Promise<SyncQueueItem[]> {
    const data = await AsyncStorage.getItem(SYNC_QUEUE_KEY);
    return data ? JSON.parse(data) : [];
  },

  async remove(id: string): Promise<void> {
    const queue = await this.getAll();
    const filtered = queue.filter((item) => item.id !== id);
    await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(filtered));
  },

  async removeByRecord(table: string, recordId: number): Promise<void> {
    const queue = await this.getAll();
    const filtered = queue.filter(
      (item) => !(item.table === table && item.recordId === recordId)
    );
    await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(filtered));
  },

  async incrementRetry(id: string): Promise<void> {
    const queue = await this.getAll();
    const index = queue.findIndex((item) => item.id === id);
    if (index !== -1) {
      queue[index].retryCount += 1;
      await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
    }
  },

  async clear(): Promise<void> {
    await AsyncStorage.removeItem(SYNC_QUEUE_KEY);
  },

  async getCount(): Promise<number> {
    const queue = await this.getAll();
    return queue.length;
  },
};
