import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { OrderItem } from '@/features/order/types/order';
import OrderItemRow from './OrderItemRow';

const sweetItem: OrderItem = {
  type: 'sweet-box',
  productId: 'sweet-box-classic',
  name: 'Caja Dulce Clásica',
  boxes: 20,
  minBoxes: 10,
};

describe('OrderItemRow', () => {
  it('renders the item name and quantity with its label', () => {
    render(<OrderItemRow item={sweetItem} onQuantityChange={vi.fn()} onRemove={vi.fn()} />);

    expect(screen.getByText('Caja Dulce Clásica')).toBeInTheDocument();
    expect(screen.getByText('20 cajas')).toBeInTheDocument();
  });

  it('calls onQuantityChange and onRemove', async () => {
    const onQuantityChange = vi.fn();
    const onRemove = vi.fn();
    render(<OrderItemRow item={sweetItem} onQuantityChange={onQuantityChange} onRemove={onRemove} />);

    await userEvent.click(screen.getByRole('button', { name: /aumentar cantidad/i }));
    expect(onQuantityChange).toHaveBeenCalledWith(21);

    await userEvent.click(screen.getByRole('button', { name: /eliminar caja dulce clásica/i }));
    expect(onRemove).toHaveBeenCalled();
  });
});
