'use client';

import Image from 'next/image';
import ScrollReveal from '@/shared/components/ScrollReveal/ScrollReveal';

const boxExamples = ['Brownies', 'Alfajores artesanales', 'Cookies', 'Mini tartas'];

const AboutPastrySection = () => {
  return (
    <section className="bg-surface py-16 lg:py-20">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
        <ScrollReveal direction="right">
          <div>
            <h2 className="font-serif text-4xl leading-tight text-foreground md:text-5xl">Nuestra pastelería</h2>
            <div className="mt-6 h-px w-20 bg-accent" aria-hidden="true" />
            <p className="mt-6 max-w-xl text-base leading-7 text-foreground-muted">
              Nuestra propuesta dulce se organiza en tortas, postres y cajas dulces. Las cajas funcionan como
              acompañamiento para eventos, por ejemplo:
            </p>

            <ul className="mt-5 flex flex-wrap gap-2" aria-label="Ejemplos de productos de una caja dulce">
              {boxExamples.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-border bg-background-secondary px-4 py-1.5 text-sm text-foreground-muted"
                >
                  {item}
                </li>
              ))}
            </ul>

            <p className="mt-6 max-w-xl text-base leading-7 text-foreground-muted">
              Proponemos combinaciones pensadas con cariño, pero siempre pueden hacerse a tu manera: si querés cambiar
              algún producto por otro de nuestro catálogo, lo conversamos y lo adaptamos a tu evento.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="left">
          <div className="relative overflow-hidden rounded-2xl border border-border">
            <Image
              src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=80"
              alt="Torta decorada junto a una caja de pastelería artesanal"
              width={900}
              height={700}
              className="h-72 w-full object-cover transition-transform duration-500 hover:scale-105 sm:h-96"
            />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default AboutPastrySection;
