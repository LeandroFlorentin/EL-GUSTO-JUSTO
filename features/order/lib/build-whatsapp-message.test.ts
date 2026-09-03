import { describe, expect, it } from 'vitest';
import type { Order } from '@/features/order/types/order';
import { buildWhatsAppMessage } from './build-whatsapp-message';

describe('buildWhatsAppMessage', () => {
  it('builds a message with sweet and savory items and customer data', () => {
    const order: Order = {
      customer: { name: 'Juan', eventDate: '15/12/2026', comments: 'El evento comienza aproximadamente a las 20 hs.' },
      items: [
        { type: 'sweet-box', productId: 'sweet-box-classic', name: 'Caja Dulce Clásica', boxes: 20, minBoxes: 10 },
        { type: 'sweet-box', productId: 'sweet-box-premium', name: 'Caja Dulce Premium', boxes: 10, minBoxes: 10 },
        {
          type: 'savory-experience',
          productId: 'savory-experience-classic',
          name: 'Experiencia Clásica',
          guests: 40,
          minGuests: 20,
        },
      ],
    };

    const message = buildWhatsAppMessage(order);

    expect(message).toBe(
      [
        'Hola, quisiera consultar por el siguiente pedido para un evento:',
        'DULCE\n\n• Caja Dulce Clásica\n20 cajas\n\n• Caja Dulce Premium\n10 cajas',
        'SALADO\n\n• Experiencia Clásica\n40 invitados',
        'Fecha del evento:\n15/12/2026',
        'Nombre:\nJuan',
        'Comentarios:\nEl evento comienza aproximadamente a las 20 hs.',
      ].join('\n\n'),
    );
  });

  it('omits the DULCE/SALADO sections when there are no items of that type', () => {
    const order: Order = {
      customer: { name: '', eventDate: '', comments: '' },
      items: [
        {
          type: 'savory-experience',
          productId: 'savory-experience-classic',
          name: 'Experiencia Clásica',
          guests: 20,
          minGuests: 20,
        },
      ],
    };

    const message = buildWhatsAppMessage(order);

    expect(message).not.toContain('DULCE');
    expect(message).toContain('SALADO');
  });

  it('omits customer sections when the fields are empty', () => {
    const order: Order = { customer: { name: '', eventDate: '', comments: '' }, items: [] };

    const message = buildWhatsAppMessage(order);

    expect(message).toBe('Hola, quisiera consultar por el siguiente pedido para un evento:');
  });
});
