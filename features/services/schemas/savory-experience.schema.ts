import { z } from 'zod';

export const savoryStageSchema = z.object({
  name: z.string().min(1),
  items: z.array(z.string().min(1)).min(1),
});

export const savoryExperienceSchema = z.object({
  id: z.string().min(1),
  type: z.literal('savory-experience'),
  name: z.string().min(1),
  description: z.string().min(1),
  image: z.string().min(1),
  minGuests: z.number().int().positive(),
  stages: z.array(savoryStageSchema).min(1),
});

export const savoryExperiencesSchema = z.array(savoryExperienceSchema);

export type SavoryStage = z.infer<typeof savoryStageSchema>;
export type SavoryExperience = z.infer<typeof savoryExperienceSchema>;
