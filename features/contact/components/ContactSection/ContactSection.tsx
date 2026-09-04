'use client';

import { motion } from 'motion/react';
import ScrollReveal from '@/shared/components/ScrollReveal/ScrollReveal';
import { contactChannels, contactDetails } from '../../data/contact-info.data';
import ContactCard from '../ContactCard/ContactCard';
import type { ContactSectionProps } from './ContactSection.types';

const gridContainerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const ContactSection = ({ className = '' }: ContactSectionProps) => {
  return (
    <section
      id="contacto"
      className={`py-16 md:py-24 bg-surface/50 text-foreground ${className}`}
      aria-label="Información de contacto"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <span className="text-xs font-semibold tracking-wider text-primary uppercase">Hablemos</span>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight">
            Ponete en contacto
          </h2>
          <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
            Estamos listos para hacer de tu evento una experiencia inolvidable. Elegí el canal que prefieras para
            comunicarte con nosotros.
          </p>
        </ScrollReveal>

        <motion.div
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          variants={gridContainerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
        >
          {contactChannels.map((channel) => (
            <motion.div key={channel.id} variants={cardVariants}>
              <ContactCard channel={channel} />
            </motion.div>
          ))}
        </motion.div>

        <ScrollReveal delay={0.2} className="mt-12 md:mt-16">
          <div className="rounded-2xl border border-border/80 bg-background/80 p-6 md:p-8 backdrop-blur-sm">
            <div className="grid gap-6 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border/60">
              {contactDetails.map((detail, index) => {
                const Icon = detail.icon;
                return (
                  <div key={detail.id} className={`flex items-start gap-4 ${index > 0 ? 'pt-6 sm:pt-0 sm:pl-8' : ''}`}>
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-foreground text-accent">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-medium text-foreground">{detail.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{detail.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default ContactSection;
