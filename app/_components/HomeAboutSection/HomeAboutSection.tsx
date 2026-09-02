import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

const galleryImages = [
  {
    src: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80',
    alt: 'Variedad de platos salados preparados para compartir',
    title: 'Cocina salada',
  },
  {
    src: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=900&q=80',
    alt: 'Selección de dulces y postres para una celebración',
    title: 'Mesa dulce',
  },
  {
    src: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80',
    alt: 'Plato principal salado presentado para un evento',
    title: 'Bocados salados',
  },
  {
    src: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=80',
    alt: 'Pastel decorado para una ocasión especial',
    title: 'Pastelería para celebrar',
  },
];

const HomeAboutSection = () => {
  return (
    <section id="nosotros" className="bg-surface py-16 lg:py-20">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.05fr_1.4fr] lg:px-8">
        <div>
          <p className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.26em] text-accent">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-accent" aria-hidden="true" />
            Sobre nosotros
          </p>

          <h2 className="font-serif text-4xl leading-tight text-foreground md:text-5xl">Sobre nosotros</h2>

          <p className="mt-4 font-serif text-3xl leading-tight text-foreground md:text-4xl">
            Sabores salados y dulces pensados para cada detalle.
          </p>

          <div className="mt-6 h-px w-20 bg-accent" aria-hidden="true" />

          <p className="mt-6 max-w-xl text-base leading-7 text-foreground-muted">
            Combinamos cocina salada, pastelería y mesas dulces con atención personalizada para crear celebraciones
            únicas, sabrosas y memorables.
          </p>

          <a
            href="#contacto"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          >
            Cotizar evento
            <ArrowRight size={16} />
          </a>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {galleryImages.map((image) => (
            <figure key={image.title}>
              <div className="relative overflow-hidden rounded-2xl border border-border bg-surface">
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={900}
                  height={900}
                  className="h-72 w-full object-cover transition-transform duration-300 hover:scale-105 sm:h-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                <figcaption className="absolute inset-x-0 bottom-0 p-4 text-left text-sm font-medium uppercase tracking-[0.2em] text-white">
                  {image.title}
                </figcaption>
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeAboutSection;
