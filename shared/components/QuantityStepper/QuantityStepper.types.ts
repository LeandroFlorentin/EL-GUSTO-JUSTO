export interface QuantityStepperProps {
  value: number;
  min?: number;
  label?: string;
  onChange: (value: number) => void;
}
