'use client';

import { Trash2 } from 'lucide-react';
import QuantityStepper from '@/shared/components/QuantityStepper/QuantityStepper';
import type { OrderItemRowProps } from './OrderItemRow.types';

const OrderItemRow = ({ item, onQuantityChange, onRemove }: OrderItemRowProps) => {
  const isSweet = item.type === 'sweet-box';
  const quantity = isSweet ? item.boxes : item.guests;
  const min = isSweet ? item.minBoxes : item.minGuests;
  const label = isSweet ? 'cajas' : 'invitados';

  return (
    <li className="flex items-center justify-between gap-4 border-b border-border py-4 last:border-none">
      <div>
        <p className="font-serif text-lg text-foreground">{item.name}</p>
        <QuantityStepper value={quantity} min={min} label={label} onChange={onQuantityChange} />
      </div>

      <button
        type="button"
        onClick={onRemove}
        aria-label={`Eliminar ${item.name}`}
        className="text-foreground-muted transition-colors hover:text-danger cursor-pointer"
      >
        <Trash2 size={18} />
      </button>
    </li>
  );
};

export default OrderItemRow;
