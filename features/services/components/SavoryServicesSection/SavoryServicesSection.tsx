import ScrollReveal from '@/shared/components/ScrollReveal/ScrollReveal';
import SavoryExperienceCard from '../SavoryExperienceCard/SavoryExperienceCard';
import type { SavoryServicesSectionProps } from './SavoryServicesSection.types';

const SavoryServicesSection = ({ experiences, onAdd }: SavoryServicesSectionProps) => {
  return (
    <section className="bg-surface py-12 md:py-16" aria-label="Propuestas saladas">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <h2 className="text-center font-serif text-4xl text-foreground md:text-5xl">Salado</h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-foreground-muted md:text-base">
            Elegí la experiencia gastronómica que mejor acompañe tu evento.
          </p>
        </ScrollReveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {experiences.map((experience) => (
            <SavoryExperienceCard
              key={experience.id}
              experience={experience}
              onAdd={(guests) => onAdd(experience, guests)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SavoryServicesSection;
