import type { SavoryExperience } from '@/features/services/schemas/savory-experience.schema';

export interface SavoryExperienceCardProps {
  experience: SavoryExperience;
  onAdd: (guests: number) => void;
}
