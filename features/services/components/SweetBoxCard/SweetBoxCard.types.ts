import type { SweetBox } from '@/features/services/schemas/sweet-box.schema';

export interface SweetBoxCardProps {
  box: SweetBox;
  onAdd: (boxes: number) => void;
}
