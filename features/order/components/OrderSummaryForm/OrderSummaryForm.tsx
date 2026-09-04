'use client';

import { useState } from 'react';
import { useOrder } from '@/features/order/hooks/use-order';
import { buildWhatsAppMessage } from '@/features/order/lib/build-whatsapp-message';
import { buildWhatsAppLink } from '@/shared/lib/whatsapp-link';

const OrderSummaryForm = () => {
  const { items, customer, setCustomer, reset, closeDrawer } = useOrder();
  const [name, setName] = useState(customer.name);
  const [eventDate, setEventDate] = useState(customer.eventDate);
  const [comments, setComments] = useState(customer.comments);

  const hasItems = items.length > 0;
  const hasRequiredCustomerData = name.trim().length > 0 && eventDate.trim().length > 0;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextCustomer = { name, eventDate, comments };
    setCustomer(nextCustomer);

    const message = buildWhatsAppMessage({ customer: nextCustomer, items });
    const link = buildWhatsAppLink(message);

    window.open(link, '_blank', 'noopener,noreferrer');

    setName('');
    setEventDate('');
    setComments('');
    reset();
    closeDrawer();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 border-t border-border pt-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="order-customer-name" className="text-xs font-semibold text-foreground-muted">
          Nombre
        </label>
        <input
          id="order-customer-name"
          type="text"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="order-event-date" className="text-xs font-semibold text-foreground-muted">
          Fecha del evento
        </label>
        <input
          id="order-event-date"
          type="date"
          required
          value={eventDate}
          onChange={(event) => setEventDate(event.target.value)}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="order-comments" className="text-xs font-semibold text-foreground-muted">
          Comentarios
        </label>
        <textarea
          id="order-comments"
          value={comments}
          onChange={(event) => setComments(event.target.value)}
          rows={3}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={!hasItems || !hasRequiredCustomerData}
        className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
      >
        Finalizar pedido por WhatsApp
      </button>
    </form>
  );
};

export default OrderSummaryForm;
