import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ContactSection from './ContactSection';

describe('ContactSection', () => {
  it('renders section title and main contact options', () => {
    render(<ContactSection />);

    expect(screen.getByRole('heading', { level: 2, name: /Ponete en contacto/i })).toBeInTheDocument();
    expect(screen.getByText(/WhatsApp Directo/i)).toBeInTheDocument();
    expect(screen.getByText(/Correo Electrónico/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Instagram' })).toBeInTheDocument();
  });

  it('renders schedule and coverage details', () => {
    render(<ContactSection />);

    expect(screen.getByText('Horarios de Atención')).toBeInTheDocument();
    expect(screen.getByText('Lunes a Sábados: 09:00 - 19:00 hs')).toBeInTheDocument();
    expect(screen.getByText('Zona de Cobertura')).toBeInTheDocument();
    expect(screen.getByText('Buenos Aires, CABA y Gran Buenos Aires')).toBeInTheDocument();
  });

  it('has section element with id "contacto"', () => {
    const { container } = render(<ContactSection />);
    const section = container.querySelector('section#contacto');
    expect(section).not.toBeNull();
  });
});
