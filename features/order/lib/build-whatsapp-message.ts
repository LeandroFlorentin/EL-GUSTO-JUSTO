import type { Order, SavoryExperienceOrderItem, SweetBoxOrderItem } from '@/features/order/types/order';

const formatSweetItem = (item: SweetBoxOrderItem) => `• ${item.name}\n${item.boxes} cajas`;

const formatSavoryItem = (item: SavoryExperienceOrderItem) => `• ${item.name}\n${item.guests} invitados`;

export const buildWhatsAppMessage = (order: Order) => {
  const sweetItems = order.items.filter((item): item is SweetBoxOrderItem => item.type === 'sweet-box');
  const savoryItems = order.items.filter(
    (item): item is SavoryExperienceOrderItem => item.type === 'savory-experience',
  );

  const sections = ['Hola, quisiera consultar por el siguiente pedido para un evento:'];

  if (sweetItems.length > 0) {
    sections.push(['DULCE', ...sweetItems.map(formatSweetItem)].join('\n'));
  }

  if (savoryItems.length > 0) {
    sections.push(['SALADO', ...savoryItems.map(formatSavoryItem)].join('\n'));
  }

  if (order.customer.eventDate) {
    sections.push(`Fecha del evento: ${order.customer.eventDate}`);
  }

  if (order.customer.name) {
    sections.push(`Nombre: ${order.customer.name}`);
  }

  if (order.customer.comments) {
    sections.push(`Comentarios: ${order.customer.comments}`);
  }

  return sections.join('\n\n');
};
