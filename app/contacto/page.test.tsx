import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ContactPage from './page';

describe('ContactPage', () => {
  it('renders contact page with contact section heading', () => {
    render(<ContactPage />);

    expect(screen.getByRole('heading', { level: 2, name: /Ponete en contacto/i })).toBeInTheDocument();
  });
});
