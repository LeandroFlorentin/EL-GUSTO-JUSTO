import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { SweetBox } from '@/features/services/schemas/sweet-box.schema';
import SweetBoxCard from './SweetBoxCard';

const box: SweetBox = {
  id: 'sweet-box-classic',
  type: 'sweet-box',
  name: 'Caja Dulce Clásica',
  description: 'Una selección de nuestros clásicos dulces.',
  image: '/image.jpg',
  minBoxes: 10,
  items: [
    { name: 'Brownie', quantity: 1 },
    { name: 'Alfajor', quantity: 2 },
  ],
};

describe('SweetBoxCard', () => {
  it('renders the box name, description, and minimum order', () => {
    render(<SweetBoxCard box={box} onAdd={vi.fn()} />);

    expect(screen.getByRole('heading', { name: box.name })).toBeInTheDocument();
    expect(screen.getByText(box.description)).toBeInTheDocument();
    expect(screen.getByText(/pedido mínimo: 10 cajas/i)).toBeInTheDocument();
    expect(screen.getByText(/2x/i)).toBeInTheDocument();
  });

  it('starts the quantity at the minimum and calls onAdd with the selected quantity', async () => {
    const onAdd = vi.fn();
    render(<SweetBoxCard box={box} onAdd={onAdd} />);

    expect(screen.getByText('10')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /aumentar cantidad/i }));
    await userEvent.click(screen.getByRole('button', { name: /agregar al pedido/i }));

    expect(onAdd).toHaveBeenCalledWith(11);
  });
});
