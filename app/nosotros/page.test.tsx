import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Nosotros from './page';

describe('Nosotros page', () => {
  it('renders the proposal, cuisine, and team sections in the qué hacemos → qué ofrecemos → quiénes lo hacen order', () => {
    render(<Nosotros />);

    expect(screen.getByRole('heading', { name: /nuestra propuesta/i })).toBeInTheDocument();
    expect(screen.getByText(/dulce \+ salado/i)).toBeInTheDocument();
    expect(screen.getByText(/solo salado/i)).toBeInTheDocument();
    expect(screen.getByText(/solo dulce/i)).toBeInTheDocument();

    expect(screen.getByRole('heading', { name: /salado y dulce, una misma experiencia/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /nuestra cocina salada/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /nuestra pastelería/i })).toBeInTheDocument();

    expect(screen.getByRole('heading', { name: /las manos detrás de cada mesa/i })).toBeInTheDocument();
    expect(screen.getByText(/gloria cavaña/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /^jorgelina$/i })).toBeInTheDocument();
  });
});
