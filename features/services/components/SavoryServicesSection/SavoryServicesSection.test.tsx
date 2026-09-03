import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { SavoryExperience } from '@/features/services/schemas/savory-experience.schema';
import SavoryServicesSection from './SavoryServicesSection';

const experiences: SavoryExperience[] = [
  {
    id: 'savory-experience-classic',
    type: 'savory-experience',
    name: 'Experiencia Clásica',
    description: 'Descripción',
    image: '/image.jpg',
    minGuests: 20,
    stages: [{ name: 'Entrada', items: ['Bruschettas'] }],
  },
];

describe('SavoryServicesSection', () => {
  it('renders the intro copy and every experience', () => {
    render(<SavoryServicesSection experiences={experiences} onAdd={vi.fn()} />);

    expect(screen.getByText(/elegí la experiencia gastronómica/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Experiencia Clásica' })).toBeInTheDocument();
  });

  it('calls onAdd with the corresponding experience', async () => {
    const onAdd = vi.fn();
    render(<SavoryServicesSection experiences={experiences} onAdd={onAdd} />);

    await userEvent.click(screen.getByRole('button', { name: /agregar al pedido/i }));

    expect(onAdd).toHaveBeenCalledWith(experiences[0], 20);
  });
});
