'use client';

import { Cookie, Soup, UtensilsCrossed } from 'lucide-react';
import { motion } from 'motion/react';
import ScrollReveal from '@/shared/components/ScrollReveal/ScrollReveal';

const modalities = [
  {
    icon: UtensilsCrossed,
    title: 'Dulce + Salado',
    description: 'La experiencia completa: cocina salada y pastelería combinadas para tu evento.',
  },
  {
    icon: Soup,
    title: 'Solo Salado',
    description: 'Bocados y platos salados para quienes buscan una propuesta enfocada en sabores salados.',
  },
  {
    icon: Cookie,
    title: 'Solo Dulce',
    description: 'Tortas, postres y mesa dulce para celebrar con lo mejor de nuestra pastelería.',
  },
];

const cardContainerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const } },
};

const AboutProposalSection = () => {
  return (
    <section className="bg-surface py-16 lg:py-20" aria-label="Nuestra propuesta">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-serif text-4xl leading-tight text-foreground md:text-5xl">Nuestra propuesta</h2>
            <p className="mt-4 text-base leading-7 text-foreground-muted">
              No creemos en paquetes cerrados. Elegí la modalidad que mejor se adapte a tu evento y armá tu propuesta
              combinando los productos que más te representen.
            </p>
          </div>
        </ScrollReveal>

        <motion.div
          className="mt-12 grid gap-6 sm:grid-cols-3"
          variants={cardContainerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {modalities.map(({ icon: Icon, title, description }) => (
            <motion.article
              key={title}
              variants={cardVariants}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl border border-border bg-background-secondary p-6 text-center md:p-7"
            >
              <div className="mx-auto mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                <Icon size={24} />
              </div>
              <h3 className="text-xl font-semibold text-foreground">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-foreground-muted">{description}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AboutProposalSection;
