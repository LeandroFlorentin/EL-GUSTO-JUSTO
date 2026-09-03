import { z } from 'zod';
import { savoryExperiencesSchema } from './savory-experience.schema';
import { sweetBoxesSchema } from './sweet-box.schema';

export const servicesSchema = z.object({
  sweet: sweetBoxesSchema,
  savory: savoryExperiencesSchema,
});

export type Services = z.infer<typeof servicesSchema>;
