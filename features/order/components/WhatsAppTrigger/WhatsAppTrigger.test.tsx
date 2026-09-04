import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import WhatsAppTrigger from './WhatsAppTrigger';

describe('WhatsAppTrigger', () => {
  it('links to a direct WhatsApp chat without prefilled text', () => {
    render(<WhatsAppTrigger />);

    expect(screen.getByRole('link', { name: /hablar por whatsapp/i })).toHaveAttribute(
      'href',
      'https://wa.me/5491100000000',
    );
  });
});
