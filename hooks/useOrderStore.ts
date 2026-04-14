import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OrdenProducto } from '@/interfaces/general.interface';
import { ProductoDisponible } from '@/modules/producto/producto.service';

type OrderItemProduct = {
  uuid: string;
  nombre: string;
  precio: number;
  stock: number;
  ilimitado?: boolean | number;
  [key: string]: unknown;
};

export interface OrderItem
  extends Omit<Partial<ProductoDisponible>, 'uuid' | 'createdAt' | 'updatedAt' | 'deletedAt'> {
  uuid: string;
  productoUuid: string;
  uuid_order_item?: string;
  estadoSync: string;
  notas?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date | null;
  updatedByUuid?: string | null;
  deletedAt?: string | Date | null;
  cantidad:number;
  observaciones?: string;
}

interface OrderState {
  items: OrderItem[];
  setItems: (items: Partial<OrderItem>[]) => void;
  addItem: (item: OrderItem) => void;
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
      items: [] as OrderItem[],
      
      setItems: (items) => set({ items: items as OrderItem[] }),
      
      addItem: (producto) =>
        set((state) => {
          const existingItem = state.items.find((item) => item.uuid === producto.uuid);
          
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.uuid === producto.uuid
                  ? { ...item, cantidad: item.cantidad + 1 }
                  : item
              ),
            };
          }
          
          return {
            items: [
              ...state.items,
              {
                ...producto,
                cantidad: producto.cantidad || 1,
                observaciones: producto.observaciones ?? producto.notas ?? '',
                notas: producto.notas ?? producto.observaciones ?? '',
              },
            ],
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
            item.uuid === productId ? { ...item, observaciones, notas: observaciones } : item
          ),
        })),
      
      getItem: (productId:string) =>
        get().items.find(item => item.productoUuid === productId),
      
      clearOrder: () => set({ items: [] }),
      
      getTotal: () =>
        get().items.reduce((total, item) => {
          const unitPrice = item.precio ?? 0;

          return total + unitPrice * item.cantidad;
        }, 0),
      
      getItemCount: () =>
        get().items.reduce((count, item) => count + item.cantidad, 0),

      getQuantity: (productId) =>
        get().items.find((item) => item.uuid === productId)?.cantidad || 0,
    }),
    {
      name: 'order-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useOrderStore;