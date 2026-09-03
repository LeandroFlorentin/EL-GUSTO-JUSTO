'use client';

import { CalendarHeart } from 'lucide-react';
import { useOrder } from '@/features/order/hooks/use-order';
import type { OrderTriggerProps } from './OrderTrigger.types';

const OrderTrigger = ({ className }: OrderTriggerProps) => {
  const { items, toggleDrawer } = useOrder();

  return (
    <button
      type="button"
      onClick={toggleDrawer}
      className={`fixed right-5 bottom-5 z-40 flex items-center gap-2 rounded-full bg-foreground px-5 py-3 font-sans text-sm font-semibold text-accent shadow-lg transition-transform hover:-translate-y-0.5 ${className ?? ''} cursor-pointer`}
    >
      <CalendarHeart size={18} />
      Tu pedido
      {items.length > 0 && (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-xs font-bold text-foreground">
          {items.length}
        </span>
      )}
    </button>
  );
};

export default OrderTrigger;
