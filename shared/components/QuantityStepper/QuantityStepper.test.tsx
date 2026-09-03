import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import QuantityStepper from '@/shared/components/QuantityStepper/QuantityStepper';

describe('QuantityStepper', () => {
  it('renders the current value', () => {
    render(<QuantityStepper value={10} onChange={vi.fn()} />);

    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('calls onChange with an incremented value', async () => {
    const onChange = vi.fn();
    render(<QuantityStepper value={10} onChange={onChange} />);

    await userEvent.click(screen.getByRole('button', { name: /aumentar cantidad/i }));

    expect(onChange).toHaveBeenCalledWith(11);
  });

  it('does not go below the minimum', async () => {
    const onChange = vi.fn();
    render(<QuantityStepper value={10} min={10} onChange={onChange} />);

    const decreaseButton = screen.getByRole('button', { name: /disminuir cantidad/i });
    expect(decreaseButton).toBeDisabled();
  });
});
