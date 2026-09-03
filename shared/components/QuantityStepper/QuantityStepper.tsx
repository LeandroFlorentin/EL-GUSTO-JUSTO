import { Minus, Plus } from 'lucide-react';
import type { QuantityStepperProps } from './QuantityStepper.types';

const QuantityStepper = ({ value, min = 0, label, onChange }: QuantityStepperProps) => {
  const decrease = () => onChange(Math.max(min, value - 1));
  const increase = () => onChange(value + 1);

  return (
    <div className="inline-flex items-center gap-3">
      <button
        type="button"
        onClick={decrease}
        disabled={value <= min}
        aria-label="Disminuir cantidad"
        className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
      >
        <Minus size={16} />
      </button>

      <span className="min-w-10 text-center font-sans text-sm font-semibold text-foreground">
        {value}
        {label ? ` ${label}` : ''}
      </span>

      <button
        type="button"
        onClick={increase}
        aria-label="Aumentar cantidad"
        className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-accent hover:text-accent cursor-pointer"
      >
        <Plus size={16} />
      </button>
    </div>
  );
};

export default QuantityStepper;
