import { HttpResponse, http } from 'msw';
import { describe, expect, it } from 'vitest';
import { getServices } from '@/features/services/api/get-services';
import { server } from '@/mocks/server';

describe('getServices', () => {
  it('returns the parsed services on a valid response', async () => {
    const services = await getServices();

    expect(services.sweet.length).toBeGreaterThan(0);
    expect(services.savory.length).toBeGreaterThan(0);
  });

  it('throws when the response is not ok', async () => {
    server.use(http.get('/api/services', () => new HttpResponse(null, { status: 500 })));

    await expect(getServices()).rejects.toThrow('Failed to fetch services: 500');
  });

  it('throws when the response shape is invalid', async () => {
    server.use(http.get('/api/services', () => HttpResponse.json({ sweet: 'not-an-array', savory: [] })));

    await expect(getServices()).rejects.toThrow('Invalid services data');
  });
});
