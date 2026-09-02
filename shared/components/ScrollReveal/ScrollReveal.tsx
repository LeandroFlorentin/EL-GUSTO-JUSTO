'use client';

import { motion } from 'motion/react';
import type { ScrollRevealDirection, ScrollRevealProps } from '@/shared/components/ScrollReveal/ScrollReveal.types';

const OFFSET = 28;

const getHiddenOffset = (direction: ScrollRevealDirection) => {
  switch (direction) {
    case 'up':
      return { y: OFFSET, x: 0 };
    case 'down':
      return { y: -OFFSET, x: 0 };
    case 'left':
      return { x: OFFSET, y: 0 };
    case 'right':
      return { x: -OFFSET, y: 0 };
    default:
      return { x: 0, y: 0 };
  }
};

/**
 * Envuelve contenido con una animación de aparición al entrar en el viewport.
 * Se ejecuta una sola vez por elemento mientras el usuario scrollea.
 */
const ScrollReveal = ({ children, className, direction = 'up', delay = 0, amount = 0.2 }: ScrollRevealProps) => {
  const hidden = getHiddenOffset(direction);

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...hidden }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
