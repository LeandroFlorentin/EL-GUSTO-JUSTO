import { Clock, Mail, MapPin, MessageCircle } from 'lucide-react';
import { InstagramIcon } from '../components/icons/InstagramIcon';
import type { ContactChannel } from '../types/contact';

const WHATSAPP_PHONE_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER || '5491100000000';

export const contactChannels: ContactChannel[] = [
  {
    id: 'whatsapp',
    title: 'WhatsApp Directo',
    value: '+54 9 11 0000-0000',
    href: `https://wa.me/${WHATSAPP_PHONE_NUMBER}`,
    icon: MessageCircle,
    actionText: 'Iniciar conversación',
    description: 'Atención personalizada e inmediata para presupuestos y consultas.',
    isExternal: true,
    badge: 'Recomendado',
  },
  {
    id: 'email',
    title: 'Correo Electrónico',
    value: 'contacto@saboresyestilo.com',
    href: 'mailto:contacto@saboresyestilo.com',
    icon: Mail,
    actionText: 'Enviar email',
    description: 'Escribinos para propuestas corporativas o consultas detalladas.',
    isExternal: false,
  },
  {
    id: 'instagram',
    title: 'Instagram',
    value: '@saboresyestilo',
    href: 'https://instagram.com/saboresyestilo',
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
