import { CalendarCheck2, ChefHat, Sparkles } from 'lucide-react';

const highlights = [
  {
    icon: ChefHat,
    title: 'Cocina salada',
    description: 'Bocados, platos y menús salados preparados a medida para cada celebración.',
  },
  {
    icon: CalendarCheck2,
    title: 'Mesa dulce',
    description: 'Postres, pastelería y detalles dulces para completar una mesa inolvidable.',
  },
  {
    icon: Sparkles,
    title: 'Catering a medida',
    description: 'Combinamos opciones saladas y dulces según el estilo de tu evento.',
  },
];

const HomeHighlights = () => {
  return (
    <section className="bg-surface py-12 md:py-16" aria-label="Principales fortalezas">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-center font-serif text-4xl text-foreground md:text-5xl">Por qué elegirnos</h2>
      </div>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-8 xl:grid-cols-3">
        {highlights.map(({ icon: Icon, title, description }) => (
          <article key={title} className="rounded-2xl border border-border bg-background-secondary p-6 md:p-7">
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
              <Icon size={24} />
            </div>

            <h3 className="text-xl font-semibold text-foreground">{title}</h3>
            <p className="mt-3 text-sm leading-6 text-foreground-muted">{description}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default HomeHighlights;
