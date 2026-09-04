import { z } from 'zod';

const sweetBoxOrderItemSchema = z.object({
  type: z.literal('sweet-box'),
  productId: z.string(),
  name: z.string(),
  boxes: z.number(),
  minBoxes: z.number(),
});

const savoryExperienceOrderItemSchema = z.object({
  type: z.literal('savory-experience'),
  productId: z.string(),
  name: z.string(),
  guests: z.number(),
  minGuests: z.number(),
});

const orderItemSchema = z.discriminatedUnion('type', [sweetBoxOrderItemSchema, savoryExperienceOrderItemSchema]);

const orderCustomerSchema = z.object({
  name: z.string(),
  eventDate: z.string(),
  comments: z.string(),
});

export const orderStorageSchema = z.object({
  items: z.array(orderItemSchema),
  customer: orderCustomerSchema,
});

export type OrderStorageState = z.infer<typeof orderStorageSchema>;
