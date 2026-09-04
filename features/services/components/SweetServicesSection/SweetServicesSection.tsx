import ScrollReveal from '@/shared/components/ScrollReveal/ScrollReveal';
import SweetBoxCard from '../SweetBoxCard/SweetBoxCard';
import type { SweetServicesSectionProps } from './SweetServicesSection.types';

const SweetServicesSection = ({ boxes, onAdd }: SweetServicesSectionProps) => {
  return (
    <section className="py-2 md:py-6" aria-label="Propuestas dulces">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <h2 className="text-center font-serif text-4xl text-foreground md:text-5xl">Dulce</h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-foreground-muted md:text-base">
            Elegí la caja que más te guste y la cantidad que necesitás para tu evento.
          </p>
        </ScrollReveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {boxes.map((box) => (
            <SweetBoxCard key={box.id} box={box} onAdd={(quantity) => onAdd(box, quantity)} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SweetServicesSection;
