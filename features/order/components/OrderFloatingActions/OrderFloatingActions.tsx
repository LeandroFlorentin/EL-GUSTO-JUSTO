'use client';

import type { ReactNode } from 'react';
import OrderDrawer from '@/features/order/components/OrderDrawer/OrderDrawer';
import OrderTrigger from '@/features/order/components/OrderTrigger/OrderTrigger';
import OrderProvider from '@/features/order/context/OrderProvider';
import { useOrder } from '@/features/order/hooks/use-order';
import WhatsAppTrigger from '../WhatsAppTrigger/WhatsAppTrigger';

interface OrderFloatingActionsProps {
  children: ReactNode;
}

const FloatingTriggers = () => {
  const { isDrawerOpen } = useOrder();

  if (isDrawerOpen) {
    return null;
  }

  return (
    <div className="fixed right-5 bottom-5 z-40 flex flex-col items-end gap-3">
      <WhatsAppTrigger />
      <OrderTrigger />
    </div>
  );
};

const OrderFloatingActions = ({ children }: OrderFloatingActionsProps) => {
  return (
    <OrderProvider>
      {children}
      <FloatingTriggers />
      <OrderDrawer />
    </OrderProvider>
  );
};

export default OrderFloatingActions;
