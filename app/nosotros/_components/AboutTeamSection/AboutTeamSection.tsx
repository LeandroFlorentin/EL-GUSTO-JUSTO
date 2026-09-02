'use client';

import Image from 'next/image';
import ScrollReveal from '@/shared/components/ScrollReveal/ScrollReveal';

const team = [
  {
    name: 'Gloria Cavaña',
    role: 'Pastelería',
    description:
      'Próxima a recibirse como Pastelera Profesional en el IAG, Gloria está detrás de nuestras tortas, postres y piezas de pastelería. Formación y atención al detalle en cada creación.',
    image: {
      src: 'https://images.unsplash.com/photo-1607478900766-efe13248b125?auto=format&fit=crop&w=900&q=80',
      alt: 'Gloria Cavaña preparando una pieza de pastelería',
    },
    imageFirst: true,
  },
  {
    name: 'Jorgelina',
    role: 'Cocina',
    description:
      'Con amplia experiencia en el rubro gastronómico, Jorgelina es la responsable de nuestra propuesta salada. Conocimiento y dedicación en cada plato.',
    image: {
      src: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=900&q=80',
      alt: 'Jorgelina cocinando en la cocina de Sabores & Estilo',
    },
    imageFirst: false,
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

        <div className="mt-14 flex flex-col gap-16">
          {team.map(({ name, role, description, image, imageFirst }) => (
            <ScrollReveal key={name} direction={imageFirst ? 'right' : 'left'}>
              <article className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
                <div
                  className={`relative overflow-hidden rounded-2xl border border-border ${imageFirst ? '' : 'lg:order-2'}`}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={900}
                    height={1000}
                    className="h-80 w-full object-cover transition-transform duration-500 hover:scale-105 lg:h-[420px]"
                  />
                </div>
                <div className={imageFirst ? '' : 'lg:order-1'}>
                  <p className="text-xs font-semibold uppercase tracking-[0.26em] text-accent">{role}</p>
                  <h3 className="mt-3 font-serif text-3xl text-foreground md:text-4xl">{name}</h3>
                  <div className="mt-4 h-px w-14 bg-accent" aria-hidden="true" />
                  <p className="mt-6 max-w-md text-base leading-7 text-foreground-muted">{description}</p>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutTeamSection;
