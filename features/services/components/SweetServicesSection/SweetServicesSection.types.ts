import type { SweetBox } from '@/features/services/schemas/sweet-box.schema';

export interface SweetServicesSectionProps {
  boxes: SweetBox[];
  onAdd: (box: SweetBox, boxes: number) => void;
}
