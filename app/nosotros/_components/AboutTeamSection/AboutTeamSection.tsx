'use client';

import ScrollReveal from '@/shared/components/ScrollReveal/ScrollReveal';

const team = [
  {
    name: 'Gloria Cavaña',
    role: 'Pastelería',
    description:
      'Próxima a recibirse como Pastelera Profesional en el IAG, Gloria está detrás de nuestras tortas, postres y piezas de pastelería. Formación y atención al detalle en cada creación.',
  },
  {
    name: 'Jorgelina',
    role: 'Cocina',
    description:
      'Con amplia experiencia en el rubro gastronómico, Jorgelina es la responsable de nuestra propuesta salada. Conocimiento y dedicación en cada plato.',
  },
];

const AboutTeamSection = () => {
  return (
    <section id="equipo" className="bg-background py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <p className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.26em] text-accent">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-accent" aria-hidden="true" />
            Quiénes somos
          </p>
          <h2 className="font-serif text-4xl leading-tight text-foreground md:text-5xl">
            Las manos detrás de cada mesa
          </h2>
        </ScrollReveal>

        <div className="mt-14 grid gap-10 sm:grid-cols-2 sm:gap-8">
          {team.map(({ name, role, description }, index) => (
            <ScrollReveal key={name} direction={index === 0 ? 'left' : 'right'}>
              <article className="flex h-full flex-col items-center rounded-2xl border border-border bg-surface p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:items-start sm:text-left">
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-accent">{role}</p>
                <h3 className="mt-3 font-serif text-3xl text-foreground md:text-4xl">{name}</h3>
                <div className="mt-4 h-px w-14 bg-accent" aria-hidden="true" />
                <p className="mt-6 text-base leading-7 text-foreground-muted">{description}</p>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutTeamSection;
