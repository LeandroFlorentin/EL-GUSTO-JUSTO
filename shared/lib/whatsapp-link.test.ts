import { describe, expect, it } from 'vitest';
import { buildWhatsAppLink } from './whatsapp-link';

describe('buildWhatsAppLink', () => {
  it('builds a direct chat link without a text query when no message is provided', () => {
    expect(buildWhatsAppLink()).toBe('https://wa.me/5491100000000');
  });

  it('encodes a provided message as the text query', () => {
    expect(buildWhatsAppLink('Hola, quisiera consultar')).toBe(
      'https://wa.me/5491100000000?text=Hola%2C%20quisiera%20consultar',
    );
  });
});
