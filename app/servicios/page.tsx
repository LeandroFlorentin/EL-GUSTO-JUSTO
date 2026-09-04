import type { Metadata } from 'next';
import ServicesView from '../servicios/_components/ServicesView/ServicesView';

export const metadata: Metadata = {
  title: 'El Gusto Justo',
  description: 'Elegí tus propuestas dulces y saladas y armá el pedido para tu evento.',
};

export default function ServicesPage() {
  return <ServicesView />;
}
