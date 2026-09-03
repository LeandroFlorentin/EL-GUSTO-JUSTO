import type { ReactNode } from 'react';
import type { OrderCustomer, OrderItem } from '@/features/order/types/order';

export interface OrderContextValue {
  items: OrderItem[];
  customer: OrderCustomer;
  isDrawerOpen: boolean;
  addItem: (item: OrderItem) => void;
  updateItemQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  setCustomer: (customer: OrderCustomer) => void;
  reset: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
}

export interface OrderProviderProps {
  children: ReactNode;
}
