'use client';

import { useOrder } from '@/features/order/hooks/use-order';
import SavoryServicesSection from '@/features/services/components/SavoryServicesSection/SavoryServicesSection';
import SweetServicesSection from '@/features/services/components/SweetServicesSection/SweetServicesSection';
import { useServices } from '@/features/services/hooks/use-services';
import type { SavoryExperience } from '@/features/services/schemas/savory-experience.schema';
import type { SweetBox } from '@/features/services/schemas/sweet-box.schema';
import ServiceCardSkeleton from '@/shared/components/ServiceCardSkeleton/ServiceCardSkeleton';

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
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders have no stable identity
            <ServiceCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <p className="py-24 text-center text-sm text-foreground-muted">
        No pudimos cargar los servicios. Intentá nuevamente en unos minutos.
      </p>
    );
  }

  return (
    <>
      <SweetServicesSection boxes={data.sweet} onAdd={handleAddSweetBox} />
      <SavoryServicesSection experiences={data.savory} onAdd={handleAddSavoryExperience} />
    </>
  );
};

const ServicesView = () => {
  return (
    <div className="bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-4 pt-16 text-center sm:px-6 lg:px-8">
        <h1 className="font-serif text-4xl text-foreground md:text-5xl">Conoce nuestros servicios</h1>
      </div>

      <ServicesContent />
    </div>
  );
};

export default ServicesView;
