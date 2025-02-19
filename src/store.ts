import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Category, Product } from './types';

interface ShoppingListState {
  products: Product[];
  categories: Category[];
  isDarkMode: boolean;
  addProduct: (name: string, categoryId: string) => void;
  toggleProduct: (id: string) => void;
  deleteProduct: (id: string) => void;
  reorderProducts: (products: Product[]) => void;
  toggleTheme: () => void;
  updateProductCategory: (productId: string, categoryId: string) => void;
}

const defaultCategories: Category[] = [
  { id: '1', name: '', color: 'bg-green-100 dark:bg-green-900/70 dark:text-green-100' },
  { id: '2', name: '', color: 'bg-blue-100 dark:bg-blue-900/70 dark:text-blue-100' },
  { id: '3', name: '', color: 'bg-red-100 dark:bg-red-900/70 dark:text-red-100' },
  { id: '4', name: '', color: 'bg-yellow-100 dark:bg-amber-900/70 dark:text-amber-100' },
  { id: '5', name: '', color: 'bg-purple-100 dark:bg-purple-900/70 dark:text-purple-100' },
];

export const useStore = create<ShoppingListState>()(
  persist(
    (set) => ({
      products: [],
      categories: defaultCategories,
      isDarkMode: false,
      addProduct: (name, categoryId) =>
        set((state) => ({
          products: [
            {
              id: crypto.randomUUID(),
              name,
              categoryId,
              purchased: false,
              order: 0,
            },
            ...state.products.map((product) => ({
              ...product,
              order: product.order + 1,
            })),
          ],
        })),
      toggleProduct: (id) =>
        set((state) => ({
          products: state.products.map((product) =>
            product.id === id
              ? { ...product, purchased: !product.purchased }
              : product
          ),
        })),
      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((product) => product.id !== id),
        })),
      reorderProducts: (products) =>
        set(() => ({
          products,
        })),
      toggleTheme: () =>
        set((state) => ({
          isDarkMode: !state.isDarkMode,
        })),
      updateProductCategory: (productId, categoryId) =>
        set((state) => ({
          products: state.products.map((product) =>
            product.id === productId
              ? { ...product, categoryId }
              : product
          ),
        })),
    }),
    {
      name: 'shopping-list-storage',
    }
  )
);