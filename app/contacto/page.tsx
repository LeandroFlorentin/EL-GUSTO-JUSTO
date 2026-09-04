import type { Metadata } from 'next';
import ContactSection from '@/features/contact/components/ContactSection/ContactSection';

export const metadata: Metadata = {
  title: 'Contacto | Sabores & Estilo Catering',
  description: 'Comunicate con nosotros por WhatsApp, email o Instagram para presupuestos y consultas para tu evento.',
};

export default function ContactPage() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <ContactSection />
    </div>
  );
}
