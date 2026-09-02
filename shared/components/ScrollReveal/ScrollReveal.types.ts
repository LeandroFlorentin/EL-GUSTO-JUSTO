import type { ReactNode } from 'react';

export type ScrollRevealDirection = 'up' | 'down' | 'left' | 'right' | 'none';

export interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  direction?: ScrollRevealDirection;
  delay?: number;
  /** Fracción del elemento visible antes de animar (0 a 1). */
  amount?: number;
}
