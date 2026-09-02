import HomeAboutSection from '@/app/_components/HomeAboutSection/HomeAboutSection';
import HomeHero from '@/app/_components/HomeHero/HomeHero';
import HomeHighlights from '@/app/_components/HomeHighlights/HomeHighlights';

export default function Home() {
  return (
    <div className="bg-background text-foreground">
      <HomeHero />
      <HomeHighlights />
      <HomeAboutSection />
    </div>
  );
}
