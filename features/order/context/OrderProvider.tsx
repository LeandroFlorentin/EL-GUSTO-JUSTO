'use client';

import { createContext, useCallback, useMemo, useState } from 'react';
import type { OrderCustomer, OrderItem } from '@/features/order/types/order';
import type { OrderContextValue, OrderProviderProps } from './OrderProvider.types';

const emptyCustomer: OrderCustomer = { name: '', eventDate: '', comments: '' };

export const OrderContext = createContext<OrderContextValue | null>(null);

const quantityOf = (item: OrderItem) => (item.type === 'sweet-box' ? item.boxes : item.guests);

const withQuantity = (item: OrderItem, quantity: number): OrderItem =>
  item.type === 'sweet-box' ? { ...item, boxes: quantity } : { ...item, guests: quantity };

const OrderProvider = ({ children }: OrderProviderProps) => {
  const [items, setItems] = useState<OrderItem[]>([]);
  const [customer, setCustomerState] = useState<OrderCustomer>(emptyCustomer);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const addItem = useCallback((item: OrderItem) => {
    setItems((current) => {
      const existingIndex = current.findIndex((it) => it.productId === item.productId && it.type === item.type);

      if (existingIndex === -1) {
        return [...current, item];
      }

      const next = [...current];
      const existing = next[existingIndex];
      next[existingIndex] = withQuantity(existing, quantityOf(existing) + quantityOf(item));
      return next;
    });
  }, []);

  const updateItemQuantity = useCallback((productId: string, quantity: number) => {
    setItems((current) => current.map((item) => (item.productId === productId ? withQuantity(item, quantity) : item)));
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((current) => current.filter((item) => item.productId !== productId));
  }, []);

  const setCustomer = useCallback((next: OrderCustomer) => setCustomerState(next), []);

  const reset = useCallback(() => {
    setItems([]);
    setCustomerState(emptyCustomer);
  }, []);

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);
  const toggleDrawer = useCallback(() => setIsDrawerOpen((current) => !current), []);

  const value = useMemo<OrderContextValue>(
    () => ({
      items,
      customer,
      isDrawerOpen,
      addItem,
      updateItemQuantity,
      removeItem,
      setCustomer,
      reset,
      openDrawer,
      closeDrawer,
      toggleDrawer,
    }),
    [
      items,
      customer,
      isDrawerOpen,
      addItem,
      updateItemQuantity,
      removeItem,
      setCustomer,
      reset,
      openDrawer,
      closeDrawer,
      toggleDrawer,
    ],
  );

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};

export default OrderProvider;
