import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from '@/interfaces';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface OrderItem extends Product {
  quantity: number;
  notes?: string;
}

interface OrderState {
  items: OrderItem[];
  addItem: (product: Product & { quantity?: number, notes?: string }) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateNotes: (productId: string, notes: string) => void;
  clearOrder: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  getQuantity: (productId: string) => number;
  getItem: (productId:string) => OrderItem | undefined
}

const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product) =>
        set((state) => {
          const existingItem = state.items.find(item => item.uuid === product.uuid);
          
          if (existingItem) {
            return {
              items: state.items.map(item =>
                item.uuid === product.uuid
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }
          
          return {
            items: [...state.items, { ...product, quantity: product.quantity || 1 }],
          };
        }),
      
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.uuid !== productId),
        })),
      
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.uuid === productId ? { ...item, quantity } : item
          ),
        })),
      
      updateNotes: (productId, notes) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.uuid === productId ? { ...item, notes } : item
          ),
        })),
      
      getItem: (productId:string) =>
        get().items.find(item => item.uuid === productId),
      
      clearOrder: () => set({ items: [] }),
      
      getTotal: () =>
        get().items.reduce(
          //se puede analizar si se usa el precio total con iva o el precio normal
          (total, item) => total + item.precio * item.quantity,
          0
        ),
      
      getItemCount: () =>
        get().items.reduce((count, item) => count + item.quantity, 0),

      getQuantity: (productId) =>
        get().items.find(item => item.uuid === productId)?.quantity || 0,
    }),
    {
      name: 'order-storage',
      // Uncomment and use with AsyncStorage for React Native
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useOrderStore;