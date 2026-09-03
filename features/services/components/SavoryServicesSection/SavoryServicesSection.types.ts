import type { SavoryExperience } from '@/features/services/schemas/savory-experience.schema';

export interface SavoryServicesSectionProps {
  experiences: SavoryExperience[];
  onAdd: (experience: SavoryExperience, guests: number) => void;
}
