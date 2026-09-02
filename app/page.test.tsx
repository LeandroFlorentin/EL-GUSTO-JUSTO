import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Home from './page';

describe('Home page', () => {
  it('renders the main hero, highlights, and about sections', () => {
    render(<Home />);

    expect(screen.getByRole('heading', { name: /sabores que se recuerdan/i })).toBeInTheDocument();
    expect(screen.getByText(/por qué elegirnos/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /cocina salada/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /mesa dulce/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /sobre nosotros/i })).toBeInTheDocument();
  });
});
