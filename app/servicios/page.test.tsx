import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import ServicesView from '../servicios/_components/ServicesView/ServicesView';

const renderPage = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  return render(
    <QueryClientProvider client={queryClient}>
      <ServicesView />
    </QueryClientProvider>,
  );
};

describe('Servicios page', () => {
  it('renders the sweet and savory sections once the services load', async () => {
    renderPage();

    expect(await screen.findByRole('heading', { name: /caja dulce clásica/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /experiencia clásica/i })).toBeInTheDocument();
  });

  it('adds an item to the order and shows it after opening the drawer', async () => {
    renderPage();

    await screen.findByRole('heading', { name: /caja dulce clásica/i });

    const addButtons = screen.getAllByRole('button', { name: /agregar al pedido/i });
    await userEvent.click(addButtons[0]);

    await userEvent.click(screen.getByRole('button', { name: /tu pedido/i }));

    expect(screen.getByRole('dialog', { name: /tu pedido/i })).toBeInTheDocument();
    expect(screen.getAllByText('Caja Dulce Clásica').length).toBeGreaterThan(0);
  });
});
