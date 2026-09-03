import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import OrderProvider from '@/features/order/context/OrderProvider';
import { useOrder } from '@/features/order/hooks/use-order';
import OrderSummaryForm from './OrderSummaryForm';

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

describe('OrderSummaryForm', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('disables the submit button when there are no items', () => {
    render(<OrderSummaryForm />, { wrapper });

    expect(screen.getByRole('button', { name: /finalizar pedido por whatsapp/i })).toBeDisabled();
  });

  it('opens WhatsApp with the generated message on submit', async () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    render(
      <>
        <AddItemHelper />
        <OrderSummaryForm />
      </>,
      { wrapper },
    );

    await userEvent.click(screen.getByRole('button', { name: /agregar helper/i }));
    await userEvent.type(screen.getByLabelText(/nombre/i), 'Juan');
    await userEvent.click(screen.getByRole('button', { name: /finalizar pedido por whatsapp/i }));

    expect(openSpy).toHaveBeenCalledTimes(1);
    const [url] = openSpy.mock.calls[0];
    expect(String(url)).toContain('https://wa.me/5491161792902?text=');
    expect(String(url)).toContain(encodeURIComponent('Caja Dulce'));
    expect(String(url)).toContain(encodeURIComponent('Juan'));
  });
});
