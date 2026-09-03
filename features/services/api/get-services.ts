import { servicesSchema } from '@/features/services/schemas/services.schema';

export const getServices = async () => {
  const response = await fetch('/api/services');

  if (!response.ok) {
    throw new Error(`Failed to fetch services: ${response.status}`);
  }

  const data = await response.json();
  const result = servicesSchema.safeParse(data);

  if (!result.success) {
    throw new Error(`Invalid services data: ${result.error.message}`);
  }

  return result.data;
};
