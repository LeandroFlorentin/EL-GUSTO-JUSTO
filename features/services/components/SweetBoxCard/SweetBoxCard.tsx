'use client';

import Image from 'next/image';
import { useState } from 'react';
import QuantityStepper from '@/shared/components/QuantityStepper/QuantityStepper';
import type { SweetBoxCardProps } from './SweetBoxCard.types';

const SweetBoxCard = ({ box, onAdd }: SweetBoxCardProps) => {
  const [boxes, setBoxes] = useState(box.minBoxes);

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="relative h-48 w-full bg-background-secondary">
        <Image src={box.image} alt={box.name} fill className="object-cover" />
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div>
          <h3 className="font-serif text-2xl text-foreground">{box.name}</h3>
          <p className="mt-2 text-sm leading-6 text-foreground-muted">{box.description}</p>
        </div>

        <ul className="flex flex-wrap gap-2 text-xs font-semibold text-foreground-muted">
          {box.items.map((item) => (
            <li key={item.name} className="rounded-full border border-border px-3 py-1">
              {item.quantity > 1 ? `${item.quantity}x ` : ''}
              {item.name}
            </li>
          ))}
        </ul>

        <p className="text-xs text-foreground-muted">Pedido mínimo: {box.minBoxes} cajas</p>

        <div className="mt-auto flex items-center justify-between gap-4 pt-2">
          <QuantityStepper value={boxes} min={box.minBoxes} onChange={setBoxes} />

          <button
            type="button"
            onClick={() => onAdd(boxes)}
            className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-accent-hover cursor-pointer"
          >
            Agregar al pedido
          </button>
        </div>
      </div>
    </article>
  );
};

export default SweetBoxCard;
