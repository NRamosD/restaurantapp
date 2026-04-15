import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import { Producto } from '@/interfaces/general.interface';
import { OrdenDetails, OrdenProductoDetails } from '@/modules/orden/orden.service';

export interface OrderItem extends OrdenProductoDetails {

}


interface OrderState {
  orderDetails: OrdenDetails | null;
  setOrderDetails: (orderDetails: OrdenDetails | null) => void;
  items: OrdenProductoDetails[];
  setItems: (items: OrdenProductoDetails[]) => void;
  addItem: (item: Producto) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, cantidad: number) => void;
  updateNotes: (productId: string, observaciones: string) => void;
  clearOrder: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  getQuantity: (productId: string) => number;
  getItem: (productId:string) => OrdenProductoDetails | undefined
}

const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      items: [] as OrdenProductoDetails[],
      orderDetails: null,
      
      setItems: (items) => set({ items }),
      setOrderDetails: (orderDetails) => set({ orderDetails: orderDetails ?? null }),
      
      addItem: (producto) =>
        set((state) => {
          if (!producto?.uuid) return state;
          const itemExist = state.items.find((item) => item.productoUuid === producto.uuid);

          if (itemExist) {
            return {
              items: state.items.map((item) =>
                item.productoUuid === producto.uuid
                  ? { ...item, cantidad: (item.cantidad || 0) + 1 }
                  : item
              ),
            };
          }
          const newItem: OrdenProductoDetails = {
            uuid: uuidv4(),
            ordenUuid: get().orderDetails?.orden?.uuid|| '',
            productoUuid: producto.uuid,
            cantidad: 1,
            precioUnitario: producto?.precio ?? 0,
            descuento: 0,
            subtotal: (producto.precio ?? 0) *1,
            iva: 0,
            total: (producto.precio ?? 0) *1,
            estadoSync: 'PENDIENTE',
            notas: null,
            createdAt: new Date(),
            updatedAt: new Date(),
            updatedByUuid: null,
            deletedAt: null,
            producto: producto,
          }
          
          return {
            items: [
              ...state.items,
              newItem
            ],
          };
        }),
      
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.productoUuid !== productId),
        })),
      
      updateQuantity: (productId, cantidad) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.productoUuid === productId ? { ...item, cantidad } : item
          ),
        })),
      
      updateNotes: (productId, observaciones) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.uuid === productId ? { ...item, notas: observaciones } : item
          ),
        })),
      
      getItem: (productId:string) =>
        get().items.find(item => item.productoUuid === productId),
      
      clearOrder: () => set({ items: [], orderDetails: null }),
      
      getTotal: () =>
        get().items.reduce((total, item) => {
          const unitPrice = item.precioUnitario ?? 0;

          return total + unitPrice * (item.cantidad || 0);
        }, 0),
      
      getItemCount: () =>
        get().items.reduce((count, item) => count + (item.cantidad || 0), 0),

      getQuantity: (productId) =>
        get().items.find((item) => item.productoUuid === productId)?.cantidad || 0,
    }),
    {
      name: 'order-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useOrderStore;