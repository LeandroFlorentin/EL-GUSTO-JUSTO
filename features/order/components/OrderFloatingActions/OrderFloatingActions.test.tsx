import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import OrderFloatingActions from './OrderFloatingActions';

describe('OrderFloatingActions', () => {
  it('hides both floating triggers while the order drawer is open', async () => {
    render(
      <OrderFloatingActions>
        <p>Contenido de la página</p>
      </OrderFloatingActions>,
    );

    await userEvent.click(screen.getByRole('button', { name: /tu pedido/i }));

    expect(screen.getByRole('dialog', { name: /tu pedido/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^Tu pedido$/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /hablar por whatsapp/i })).not.toBeInTheDocument();
  });
});
