'use client';

import ScrollReveal from '@/shared/components/ScrollReveal/ScrollReveal';

const AboutCuisineIntro = () => {
  return (
    <div className="bg-background pt-16 lg:pt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-4 flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.26em] text-accent">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-accent" aria-hidden="true" />
              Nuestras propuestas gastronómicas
            </p>
            <h2 className="font-serif text-4xl leading-tight text-foreground md:text-5xl">
              Salado y dulce, una misma experiencia
            </h2>
            <p className="mt-4 text-base leading-7 text-foreground-muted">
              Dos áreas con identidad propia que se combinan para armar la propuesta perfecta para tu evento.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default AboutCuisineIntro;
