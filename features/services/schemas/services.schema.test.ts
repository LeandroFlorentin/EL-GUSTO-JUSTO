import { describe, expect, it } from 'vitest';
import { servicesSchema } from './services.schema';

const validServices = {
  sweet: [
    {
      id: 'sweet-box-classic',
      type: 'sweet-box',
      name: 'Caja Dulce Clásica',
      description: 'Descripción',
      image: '/image.jpg',
      minBoxes: 10,
      items: [{ name: 'Brownie', quantity: 1 }],
    },
  ],
  savory: [
    {
      id: 'savory-experience-classic',
      type: 'savory-experience',
      name: 'Experiencia Clásica',
      description: 'Descripción',
      image: '/image.jpg',
      minGuests: 20,
      stages: [{ name: 'Entrada', items: ['Bruschettas'] }],
    },
  ],
};

describe('servicesSchema', () => {
  it('accepts valid services', () => {
    const result = servicesSchema.safeParse(validServices);
    expect(result.success).toBe(true);
  });

  it('rejects a sweet box without items', () => {
    const invalid = {
      ...validServices,
      sweet: [{ ...validServices.sweet[0], items: [] }],
    };
    const result = servicesSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects a savory experience with non-positive minGuests', () => {
    const invalid = {
      ...validServices,
      savory: [{ ...validServices.savory[0], minGuests: 0 }],
    };
    const result = servicesSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects an unknown type discriminator', () => {
    const invalid = {
      ...validServices,
      sweet: [{ ...validServices.sweet[0], type: 'sweet-combo' }],
    };
    const result = servicesSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
