import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from '@/interfaces';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OrdenProducto, Producto } from '@/interfaces/general.interface';

// export interface OrderItem extends Product {
//   cantidad: number;
//   observaciones?: string;
//   ordenProductos?: OrdenProducto & { producto: Producto }; 
// }
export interface OrderItem extends OrdenProducto {
  producto: Producto;
}

interface OrderState {
  items: any[];
  addItem: (item: any) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, cantidad: number) => void;
  updateNotes: (productId: string, observaciones: string) => void;
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
      
      addItem: (producto) =>
        set((state) => {
          const existingItem = state.items.find(item => item.uuid === producto.uuid);
          
          if (existingItem) {
            return {
              items: state.items.map(item =>
                item.uuid === producto.uuid
                  ? { ...item, cantidad: item.cantidad + 1 }
                  : item
              ),
            };
          }
          
          return {
            items: [...state.items, { ...producto, cantidad: producto.cantidad || 1 }],
          };
        }),
      
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.uuid !== productId),
        })),
      
      updateQuantity: (productId, cantidad) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.uuid === productId ? { ...item, cantidad } : item
          ),
        })),
      
      updateNotes: (productId, observaciones) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.uuid === productId ? { ...item, observaciones } : item
          ),
        })),
      
      getItem: (productId:string) =>
        get().items.find(item => item.uuid === productId),
      
      clearOrder: () => set({ items: [] }),
      
      getTotal: () => 0,
        // get().items.reduce(
        //   //se puede analizar si se usa el precio total con iva o el precio normal
        //   (total, item) => total + item.precio * item.cantidad,
        //   0
        // ),
      
      getItemCount: () =>
        get().items.reduce((count, item) => count + item.cantidad, 0),

      getQuantity: (productId) =>
        get().items.find(item => item.uuid === productId)?.cantidad || 0,
    }),
    {
      name: 'order-storage',
      // Uncomment and use with AsyncStorage for React Native
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useOrderStore;