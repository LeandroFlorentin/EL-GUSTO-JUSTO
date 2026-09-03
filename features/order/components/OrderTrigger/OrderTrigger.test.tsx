import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import OrderProvider from '@/features/order/context/OrderProvider';
import { useOrder } from '@/features/order/hooks/use-order';
import OrderTrigger from './OrderTrigger';

const wrapper = ({ children }: { children: ReactNode }) => <OrderProvider>{children}</OrderProvider>;

const AddItemHelper = () => {
  const { addItem } = useOrder();
  return (
    <button
      type="button"
      onClick={() =>
        addItem({ type: 'sweet-box', productId: 'sweet-box-classic', name: 'Caja Dulce', boxes: 10, minBoxes: 10 })
      }
    >
      Agregar helper
    </button>
  );
};

describe('OrderTrigger', () => {
  it('renders without a badge when there are no items', () => {
    render(<OrderTrigger />, { wrapper });

    expect(screen.getByRole('button', { name: /tu pedido/i })).toBeInTheDocument();
    expect(screen.queryByText('1')).not.toBeInTheDocument();
  });

  it('shows the item count once an item is added', async () => {
    render(
      <>
        <AddItemHelper />
        <OrderTrigger />
      </>,
      { wrapper },
    );

    await userEvent.click(screen.getByRole('button', { name: /agregar helper/i }));

    expect(screen.getByText('1')).toBeInTheDocument();
  });
});
