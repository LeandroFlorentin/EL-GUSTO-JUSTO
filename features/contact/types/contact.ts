import type { ComponentType } from 'react';

export interface ContactChannel {
  id: string;
  title: string;
  value: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  actionText: string;
  description: string;
  isExternal?: boolean;
  badge?: string;
}
