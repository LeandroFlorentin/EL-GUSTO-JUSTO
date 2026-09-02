import type { Metadata } from 'next';
import AboutCuisineIntro from '@/app/nosotros/_components/AboutCuisineIntro/AboutCuisineIntro';
import AboutPastrySection from '@/app/nosotros/_components/AboutPastrySection/AboutPastrySection';
import AboutProposalSection from '@/app/nosotros/_components/AboutProposalSection/AboutProposalSection';
import AboutSavorySection from '@/app/nosotros/_components/AboutSavorySection/AboutSavorySection';
import AboutTeamSection from '@/app/nosotros/_components/AboutTeamSection/AboutTeamSection';

export const metadata: Metadata = {
  title: 'Nosotros | Sabores & Estilo Catering',
  description: 'Conocé al equipo detrás de Sabores & Estilo Catering y cómo funciona nuestra propuesta gastronómica.',
};

const Nosotros = () => {
  return (
    <div className="bg-background text-foreground">
      <AboutProposalSection />
      <AboutCuisineIntro />
      <AboutSavorySection />
      <AboutPastrySection />
      <AboutTeamSection />
    </div>
  );
};

export default Nosotros;
