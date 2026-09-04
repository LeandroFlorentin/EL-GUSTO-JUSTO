import { Clock, Mail, MapPin } from 'lucide-react';
import { InstagramIcon } from '@/shared/components/icons/InstagramIcon';
import { WhatsAppIcon } from '@/shared/components/icons/WhatsAppIcon';
import { buildWhatsAppLink } from '@/shared/lib/whatsapp-link';
import type { ContactChannel } from '../types/contact';

export const contactChannels: ContactChannel[] = [
  {
    id: 'whatsapp',
    title: 'WhatsApp Directo',
    value: '+54 9 11 0000-0000',
    href: buildWhatsAppLink(),
    icon: WhatsAppIcon,
    actionText: 'Iniciar conversación',
    description: 'Atención personalizada e inmediata para presupuestos y consultas.',
    isExternal: true,
    badge: 'Recomendado',
  },
  {
    id: 'email',
    title: 'Correo Electrónico',
    value: 'contacto@elgustojusto.com',
    href: 'mailto:contacto@elgustojusto.com',
    icon: Mail,
    actionText: 'Enviar email',
    description: 'Escribinos para propuestas corporativas o consultas detalladas.',
    isExternal: false,
  },
  {
    id: 'instagram',
    title: 'Instagram',
    value: '@elgustojusto',
    href: 'https://instagram.com/elgustojusto',
    icon: InstagramIcon,
    actionText: 'Ver perfil',
    description: 'Descubrí nuestras últimas creaciones, eventos e inspiración.',
    isExternal: true,
  },
];

export const contactDetails = [
  {
    id: 'schedule',
    title: 'Horarios de Atención',
    value: 'Lunes a Sábados: 09:00 - 19:00 hs',
    icon: Clock,
  },
  {
    id: 'coverage',
    title: 'Zona de Cobertura',
    value: 'Buenos Aires, CABA y Gran Buenos Aires',
    icon: MapPin,
  },
];
