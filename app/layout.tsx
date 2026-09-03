import './global.css';
import { MotionConfig } from 'motion/react';
import type { Metadata } from 'next';
import { Cormorant_Garamond, Montserrat } from 'next/font/google';
import Providers from '@/app/providers';
import MainLayout from '@/shared/layouts/MainLayout/MainLayout';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Sabores',
  description: 'Catering & Eventos',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    // suppressHydrationWarning: extensiones del navegador (ej. Katalon, Grammarly) inyectan atributos en <html>/<body> antes de hidratar
    <html
      lang="en"
      className={`${cormorant.variable} ${montserrat.variable} h-full antialiased `}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <MotionConfig reducedMotion="user">
          <Providers>
            <MainLayout>{children}</MainLayout>
          </Providers>
        </MotionConfig>
      </body>
    </html>
  );
}
