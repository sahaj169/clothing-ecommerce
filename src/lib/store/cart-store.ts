import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Size } from "@prisma/client";

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size: Size;
  stockCount: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateItemQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
  syncWithServer: (serverItems: CartItem[]) => void;
  initializeCart: (items: CartItem[]) => void;
  validateStock: (
    productId: string,
    quantity: number,
    stockCount: number
  ) => boolean;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const { items, validateStock } = get();
        const existingItem = items.find(
          (i) => i.productId === item.productId && i.size === item.size
        );

        if (existingItem) {
          const newQuantity = existingItem.quantity + item.quantity;
          const stockCount = item.stockCount || Infinity;

          if (!validateStock(item.productId, newQuantity, stockCount)) {
            return;
          }

          return set({
            items: items.map((i) =>
              i.productId === item.productId && i.size === item.size
                ? { ...i, quantity: newQuantity }
                : i
            ),
          });
        }

        set({ items: [...items, item] });
      },

      removeItem: (id) => {
        const { items } = get();
        set({ items: items.filter((item) => item.id !== id) });
      },

      updateItemQuantity: (id, quantity) => {
        const { items } = get();
        const item = items.find((item) => item.id === id);

        if (!item || quantity < 1) return;

        const stockCount = item.stockCount || Infinity;
        if (quantity > stockCount) {
          quantity = stockCount;
        }

        set({
          items: items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },

      totalPrice: () => {
        const { items } = get();
        return items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      syncWithServer: (serverItems) => {
        if (serverItems && serverItems.length > 0) {
          const { items } = get();

          if (items.length === 0) {
            set({ items: serverItems });
            return;
          }

          const existingItemsMap = new Map();
          items.forEach((item) => {
            const key = `${item.productId}-${item.size}`;
            existingItemsMap.set(key, item);
          });

          const mergedItems = serverItems.map((serverItem) => {
            const key = `${serverItem.productId}-${serverItem.size}`;
            const localItem = existingItemsMap.get(key);

            if (localItem) {
              existingItemsMap.delete(key);
              return {
                ...serverItem,
                quantity:
                  localItem.quantity !== serverItem.quantity
                    ? localItem.quantity
                    : serverItem.quantity,
              };
            }

            return serverItem;
          });

          existingItemsMap.forEach((localItem) => {
            mergedItems.push(localItem);
          });

          set({ items: mergedItems });
        }
      },

      initializeCart: (items) => {
        if (items && items.length > 0 && get().items.length === 0) {
          set({ items });
        }
      },

      validateStock: (productId, quantity, stockCount) => {
        if (quantity <= 0) return false;
        if (stockCount === 0) return false;
        if (quantity > stockCount) return false;
        return true;
      },
    }),
    {
      name: "cart-storage",
    }
  )
);
