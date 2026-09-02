import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import ScrollReveal from '@/shared/components/ScrollReveal/ScrollReveal';

describe('ScrollReveal', () => {
  it('renders its children', () => {
    render(
      <ScrollReveal>
        <p>Contenido animado</p>
      </ScrollReveal>,
    );

    expect(screen.getByText('Contenido animado')).toBeInTheDocument();
  });
});
