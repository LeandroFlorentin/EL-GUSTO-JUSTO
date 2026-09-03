import { act, render, renderHook, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import { useOrder } from '@/features/order/hooks/use-order';
import OrderProvider from './OrderProvider';

const wrapper = ({ children }: { children: ReactNode }) => <OrderProvider>{children}</OrderProvider>;

describe('OrderProvider / useOrder', () => {
  it('throws when used outside of an OrderProvider', () => {
    expect(() => renderHook(() => useOrder())).toThrow('useOrder must be used within an OrderProvider');
  });

  it('starts with no items and the drawer closed', () => {
    const { result } = renderHook(() => useOrder(), { wrapper });

    expect(result.current.items).toEqual([]);
    expect(result.current.isDrawerOpen).toBe(false);
  });

  it('adds an item, keeps the drawer closed, and merges quantities for the same product', () => {
    const { result } = renderHook(() => useOrder(), { wrapper });

    act(() =>
      result.current.addItem({
        type: 'sweet-box',
        productId: 'sweet-box-classic',
        name: 'Caja Dulce Clásica',
        boxes: 10,
        minBoxes: 10,
      }),
    );

    expect(result.current.items).toHaveLength(1);
    expect(result.current.isDrawerOpen).toBe(false);

    act(() =>
      result.current.addItem({
        type: 'sweet-box',
        productId: 'sweet-box-classic',
        name: 'Caja Dulce Clásica',
        boxes: 5,
        minBoxes: 10,
      }),
    );

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0]).toMatchObject({ boxes: 15 });
  });

  it('updates quantity and removes an item', () => {
    const { result } = renderHook(() => useOrder(), { wrapper });

    act(() =>
      result.current.addItem({
        type: 'savory-experience',
        productId: 'savory-experience-classic',
        name: 'Experiencia Clásica',
        guests: 20,
        minGuests: 20,
      }),
    );

    act(() => result.current.updateItemQuantity('savory-experience-classic', 40));
    expect(result.current.items[0]).toMatchObject({ guests: 40 });

    act(() => result.current.removeItem('savory-experience-classic'));
    expect(result.current.items).toEqual([]);
  });

  it('renders children', () => {
    render(
      <OrderProvider>
        <p>Contenido del pedido</p>
      </OrderProvider>,
    );

    expect(screen.getByText('Contenido del pedido')).toBeInTheDocument();
  });
});
