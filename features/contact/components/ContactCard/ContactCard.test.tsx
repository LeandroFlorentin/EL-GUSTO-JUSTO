import { render, screen } from '@testing-library/react';
import { Mail } from 'lucide-react';
import { describe, expect, it } from 'vitest';
import type { ContactChannel } from '../../types/contact';
import { WhatsAppIcon } from '../icons/WhatsAppIcon';
import ContactCard from './ContactCard';

const mockWhatsAppChannel: ContactChannel = {
  id: 'whatsapp',
  title: 'WhatsApp Directo',
  value: '+54 9 11 0000-0000',
  href: 'https://wa.me/5491100000000',
  icon: WhatsAppIcon,
  actionText: 'Iniciar conversación',
  description: 'Atención personalizada',
  isExternal: true,
  badge: 'Recomendado',
};

const mockEmailChannel: ContactChannel = {
  id: 'email',
  title: 'Correo Electrónico',
  value: 'contacto@saboresyestilo.com',
  href: 'mailto:contacto@saboresyestilo.com',
  icon: Mail,
  actionText: 'Enviar email',
  description: 'Escribinos para propuestas',
  isExternal: false,
};

describe('ContactCard', () => {
  it('renders channel details correctly', () => {
    render(<ContactCard channel={mockWhatsAppChannel} />);

    expect(screen.getByText('WhatsApp Directo')).toBeInTheDocument();
    expect(screen.getByText('+54 9 11 0000-0000')).toBeInTheDocument();
    expect(screen.getByText('Atención personalizada')).toBeInTheDocument();
    expect(screen.getByText('Recomendado')).toBeInTheDocument();
  });

  it('renders WhatsApp link without query parameters', () => {
    render(<ContactCard channel={mockWhatsAppChannel} />);

    const link = screen.getByRole('link', { name: /Iniciar conversación/i });
    expect(link).toHaveAttribute('href', 'https://wa.me/5491100000000');
    expect(link).not.toHaveAttribute('href', expect.stringContaining('?text='));
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders email mailto link correctly', () => {
    render(<ContactCard channel={mockEmailChannel} />);

    const link = screen.getByRole('link', { name: /Enviar email/i });
    expect(link).toHaveAttribute('href', 'mailto:contacto@saboresyestilo.com');
    expect(link).not.toHaveAttribute('target');
  });
});
