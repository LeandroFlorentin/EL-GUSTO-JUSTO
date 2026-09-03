'use client';

import OrderDrawer from '@/features/order/components/OrderDrawer/OrderDrawer';
import OrderTrigger from '@/features/order/components/OrderTrigger/OrderTrigger';
import OrderProvider from '@/features/order/context/OrderProvider';
import { useOrder } from '@/features/order/hooks/use-order';
import SavoryServicesSection from '@/features/services/components/SavoryServicesSection/SavoryServicesSection';
import SweetServicesSection from '@/features/services/components/SweetServicesSection/SweetServicesSection';
import { useServices } from '@/features/services/hooks/use-services';
import type { SavoryExperience } from '@/features/services/schemas/savory-experience.schema';
import type { SweetBox } from '@/features/services/schemas/sweet-box.schema';

const ServicesContent = () => {
  const { data, isLoading, isError } = useServices();
  const { addItem } = useOrder();

  const handleAddSweetBox = (box: SweetBox, boxes: number) => {
    addItem({ type: 'sweet-box', productId: box.id, name: box.name, boxes, minBoxes: box.minBoxes });
  };

  const handleAddSavoryExperience = (experience: SavoryExperience, guests: number) => {
    addItem({
      type: 'savory-experience',
      productId: experience.id,
      name: experience.name,
      guests,
      minGuests: experience.minGuests,
    });
  };

  if (isLoading) {
    return <p className="py-24 text-center text-sm text-foreground-muted">Cargando catálogo...</p>;
  }

  if (isError || !data) {
    return (
      <p className="py-24 text-center text-sm text-foreground-muted">
        No pudimos cargar el catálogo. Intentá nuevamente en unos minutos.
      </p>
    );
  }

  return (
    <>
      <SweetServicesSection boxes={data.sweet} onAdd={handleAddSweetBox} />
      <SavoryServicesSection experiences={data.savory} onAdd={handleAddSavoryExperience} />
      <OrderTrigger />
      <OrderDrawer />
    </>
  );
};

const ServicesView = () => {
  return (
    <OrderProvider>
      <div className="bg-background text-foreground">
        <div className="mx-auto max-w-3xl px-4 pt-16 text-center sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl text-foreground md:text-5xl">Catálogo</h1>
          <p className="mt-3 text-sm text-foreground-muted md:text-base">
            Recorré nuestras propuestas dulces y saladas y armá el pedido para tu evento.
          </p>
        </div>

        <ServicesContent />
      </div>
    </OrderProvider>
  );
};

export default ServicesView;
