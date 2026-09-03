import type { OrderItem } from '@/features/order/types/order';

export interface OrderItemRowProps {
  item: OrderItem;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
}
