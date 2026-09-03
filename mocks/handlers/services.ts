import { HttpResponse, http } from 'msw';
import servicesData from '@/data/services.json';

export const servicesHandlers = [
  http.get('/api/services', () => {
    return HttpResponse.json(servicesData);
  }),
];
