'use client';

import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import Link from 'next/link';
import { useOrder } from '@/features/order/hooks/use-order';
import OrderItemRow from '../OrderItemRow/OrderItemRow';
import OrderSummaryForm from '../OrderSummaryForm/OrderSummaryForm';

const OrderDrawer = () => {
  const { items, isDrawerOpen, closeDrawer, updateItemQuantity, removeItem } = useOrder();

  const sweetItems = items.filter((item) => item.type === 'sweet-box');
  const savoryItems = items.filter((item) => item.type === 'savory-experience');

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            aria-hidden="true"
            className="fixed inset-0 z-40 bg-foreground/40"
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-label="Tu pedido"
            className="fixed top-0 right-0 z-50 flex h-full w-full max-w-md flex-col overflow-y-auto bg-background p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-3xl text-foreground">Tu pedido</h2>

              <button
                type="button"
                onClick={closeDrawer}
                aria-label="Cerrar tu pedido"
                className="text-foreground-muted hover:text-foreground cursor-pointer"
              >
                <X size={22} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="mt-8 flex flex-col items-start gap-4">
                <p className="text-sm text-foreground-muted">
                  Todavía no seleccionaste nada. Recorré los servicios y agregá lo que necesites para tu evento.
                </p>
                <Link
                  href="/servicios"
                  onClick={closeDrawer}
                  className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent-hover"
                >
                  Ver servicios
                </Link>
              </div>
            ) : (
              <div className="mt-6 flex flex-col gap-6">
                {sweetItems.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-accent">Dulce</h3>
                    <ul>
                      {sweetItems.map((item) => (
                        <OrderItemRow
                          key={item.productId}
                          item={item}
                          onQuantityChange={(quantity) => updateItemQuantity(item.productId, quantity)}
                          onRemove={() => removeItem(item.productId)}
                        />
                      ))}
                    </ul>
                  </div>
                )}

                {savoryItems.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-accent">Salado</h3>
                    <ul>
                      {savoryItems.map((item) => (
                        <OrderItemRow
                          key={item.productId}
                          item={item}
                          onQuantityChange={(quantity) => updateItemQuantity(item.productId, quantity)}
                          onRemove={() => removeItem(item.productId)}
                        />
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {items.length > 0 && (
              <div className="mt-auto pt-6">
                <OrderSummaryForm />
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default OrderDrawer;
