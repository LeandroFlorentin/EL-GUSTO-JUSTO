'use client';

import Image from 'next/image';
import ScrollReveal from '@/shared/components/ScrollReveal/ScrollReveal';

const AboutSavorySection = () => {
  return (
    <section className="bg-background pt-8 pb-16 lg:pt-10 lg:pb-20">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
        <ScrollReveal direction="right">
          <div className="relative overflow-hidden rounded-2xl border border-border">
            <Image
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80"
              alt="Variedad de platos salados preparados para un evento"
              width={900}
              height={700}
              className="h-72 w-full object-cover transition-transform duration-500 hover:scale-105 sm:h-96"
            />
          </div>
        </ScrollReveal>

        <ScrollReveal direction="left">
          <div>
            <h2 className="font-serif text-4xl leading-tight text-foreground md:text-5xl">Nuestra cocina salada</h2>
            <div className="mt-6 h-px w-20 bg-accent" aria-hidden="true" />
            <p className="mt-6 max-w-xl text-base leading-7 text-foreground-muted">
              Ofrecemos bocados, platos y preparaciones saladas pensadas para acompañar cualquier tipo de evento. Elegís
              las opciones que más te gusten y las combinamos según la cantidad de invitados y tus preferencias.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default AboutSavorySection;
