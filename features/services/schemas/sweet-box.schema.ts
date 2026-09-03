import { z } from 'zod';

export const sweetBoxItemSchema = z.object({
  name: z.string().min(1),
  quantity: z.number().int().positive(),
});

export const sweetBoxSchema = z.object({
  id: z.string().min(1),
  type: z.literal('sweet-box'),
  name: z.string().min(1),
  description: z.string().min(1),
  image: z.string().min(1),
  minBoxes: z.number().int().positive(),
  items: z.array(sweetBoxItemSchema).min(1),
});

export const sweetBoxesSchema = z.array(sweetBoxSchema);

export type SweetBoxItem = z.infer<typeof sweetBoxItemSchema>;
export type SweetBox = z.infer<typeof sweetBoxSchema>;
