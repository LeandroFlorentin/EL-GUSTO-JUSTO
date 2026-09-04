import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import OrderProvider from '@/features/order/context/OrderProvider';
import { useOrder } from '@/features/order/hooks/use-order';
import OrderDrawer from './OrderDrawer';

const wrapper = ({ children }: { children: ReactNode }) => <OrderProvider>{children}</OrderProvider>;

const Controls = () => {
  const { addItem, openDrawer } = useOrder();
  return (
    <button
      type="button"
      onClick={() => {
        addItem({
          type: 'sweet-box',
          productId: 'sweet-box-classic',
          name: 'Caja Dulce Clásica',
          boxes: 20,
          minBoxes: 10,
        });
        addItem({
          type: 'savory-experience',
          productId: 'savory-experience-classic',
          name: 'Experiencia Clásica',
          guests: 40,
          minGuests: 20,
        });
        openDrawer();
      }}
    >
      Preparar pedido
    </button>
  );
};

describe('OrderDrawer', () => {
  it('is not rendered when closed', () => {
    render(<OrderDrawer />, { wrapper });

    expect(screen.queryByRole('dialog', { name: /tu pedido/i })).not.toBeInTheDocument();
  });

  it('shows the empty state message when open with no items', async () => {
    const OpenHelper = () => {
      const { openDrawer } = useOrder();
      return (
        <button type="button" onClick={openDrawer}>
          Abrir
        </button>
      );
    };

    render(
      <>
        <OpenHelper />
        <OrderDrawer />
      </>,
      { wrapper },
    );

    await userEvent.click(screen.getByRole('button', { name: /abrir/i }));

    expect(screen.getByText(/todavía no seleccionaste nada/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /ver servicios/i })).toHaveAttribute('href', '/servicios');
    expect(screen.queryByRole('button', { name: /finalizar pedido por whatsapp/i })).not.toBeInTheDocument();
  });

  it('lists sweet and savory items grouped by section', async () => {
    render(
      <>
        <Controls />
        <OrderDrawer />
      </>,
      { wrapper },
    );

    await userEvent.click(screen.getByRole('button', { name: /preparar pedido/i }));

    expect(screen.getByText('Dulce')).toBeInTheDocument();
    expect(screen.getByText('Salado')).toBeInTheDocument();
    expect(screen.getByText('Caja Dulce Clásica')).toBeInTheDocument();
    expect(screen.getByText('Experiencia Clásica')).toBeInTheDocument();
  });
});
