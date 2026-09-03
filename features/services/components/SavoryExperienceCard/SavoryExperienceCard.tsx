'use client';

import Image from 'next/image';
import { useState } from 'react';
import QuantityStepper from '@/shared/components/QuantityStepper/QuantityStepper';
import type { SavoryExperienceCardProps } from './SavoryExperienceCard.types';

const SavoryExperienceCard = ({ experience, onAdd }: SavoryExperienceCardProps) => {
  const [guests, setGuests] = useState(experience.minGuests);

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="relative h-48 w-full bg-background-secondary">
        <Image src={experience.image} alt={experience.name} fill className="object-cover" />
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div>
          <h3 className="font-serif text-2xl text-foreground">{experience.name}</h3>
          <p className="mt-2 text-sm leading-6 text-foreground-muted">{experience.description}</p>
        </div>

        <dl className="flex flex-col gap-2">
          {experience.stages.map((stage) => (
            <div key={stage.name}>
              <dt className="text-xs font-semibold uppercase tracking-wide text-accent">{stage.name}</dt>
              <dd className="text-sm text-foreground-muted">{stage.items.join(', ')}</dd>
            </div>
          ))}
        </dl>

        <p className="text-xs text-foreground-muted">Mínimo: {experience.minGuests} invitados</p>

        <div className="mt-auto flex items-center justify-between gap-4 pt-2">
          <QuantityStepper value={guests} min={experience.minGuests} onChange={setGuests} />

          <button
            type="button"
            onClick={() => onAdd(guests)}
            className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-accent-hover cursor-pointer"
          >
            Agregar al pedido
          </button>
        </div>
      </div>
    </article>
  );
};

export default SavoryExperienceCard;
