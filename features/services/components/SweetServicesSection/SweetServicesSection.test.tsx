import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { SweetBox } from '@/features/services/schemas/sweet-box.schema';
import SweetServicesSection from './SweetServicesSection';

const boxes: SweetBox[] = [
  {
    id: 'sweet-box-classic',
    type: 'sweet-box',
    name: 'Caja Dulce Clásica',
    description: 'Descripción',
    image: '/image.jpg',
    minBoxes: 10,
    items: [{ name: 'Brownie', quantity: 1 }],
  },
  {
    id: 'sweet-box-premium',
    type: 'sweet-box',
    name: 'Caja Dulce Premium',
    description: 'Descripción',
    image: '/image.jpg',
    minBoxes: 15,
    items: [{ name: 'Macaron', quantity: 2 }],
  },
];

describe('SweetServicesSection', () => {
  it('renders the intro copy and every box', () => {
    render(<SweetServicesSection boxes={boxes} onAdd={vi.fn()} />);

    expect(screen.getByText(/elegí la caja que más te guste/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Caja Dulce Clásica' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Caja Dulce Premium' })).toBeInTheDocument();
  });

  it('calls onAdd with the corresponding box', async () => {
    const onAdd = vi.fn();
    render(<SweetServicesSection boxes={boxes} onAdd={onAdd} />);

    const addButtons = screen.getAllByRole('button', { name: /agregar al pedido/i });
    await userEvent.click(addButtons[1]);

    expect(onAdd).toHaveBeenCalledWith(boxes[1], 15);
  });
});
