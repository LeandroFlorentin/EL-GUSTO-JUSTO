import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { SavoryExperience } from '@/features/services/schemas/savory-experience.schema';
import SavoryExperienceCard from './SavoryExperienceCard';

const experience: SavoryExperience = {
  id: 'savory-experience-classic',
  type: 'savory-experience',
  name: 'Experiencia Clásica',
  description: 'Una propuesta gastronómica completa.',
  image: '/image.jpg',
  minGuests: 20,
  stages: [
    { name: 'Entrada', items: ['Bruschettas', 'Bocaditos'] },
    { name: 'Principal', items: ['Mini sandwiches', 'Empanadas'] },
  ],
};

describe('SavoryExperienceCard', () => {
  it('renders the experience name, description, and stages', () => {
    render(<SavoryExperienceCard experience={experience} onAdd={vi.fn()} />);

    expect(screen.getByRole('heading', { name: experience.name })).toBeInTheDocument();
    expect(screen.getByText(/bruschettas, bocaditos/i)).toBeInTheDocument();
    expect(screen.getByText(/mínimo: 20 invitados/i)).toBeInTheDocument();
  });

  it('starts guests at the minimum and calls onAdd with the selected amount', async () => {
    const onAdd = vi.fn();
    render(<SavoryExperienceCard experience={experience} onAdd={onAdd} />);

    await userEvent.click(screen.getByRole('button', { name: /aumentar cantidad/i }));
    await userEvent.click(screen.getByRole('button', { name: /agregar al pedido/i }));

    expect(onAdd).toHaveBeenCalledWith(21);
  });
});
