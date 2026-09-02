import { ArrowRight } from 'lucide-react';

const HomeHero = () => {
  return (
    <section
      className="relative isolate overflow-hidden bg-black"
      aria-label="Sección principal de la página de inicio"
    >
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1800&q=80')] bg-cover bg-center opacity-55" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/95 from-25% via-black/65 via-38% to-black/10 to-100%" />

      <div className="relative mx-auto flex min-h-[620px] max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-xl text-white">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.32em] text-accent">Catering & eventos</p>

          <h1 className="font-serif text-5xl leading-none md:text-7xl">
            Sabores que <span className="italic text-accent">se recuerdan</span>
          </h1>

          <p className="mt-6 max-w-md text-base leading-7 text-white/85 md:text-lg">
            Creamos propuestas saladas y dulces para bodas, celebraciones y reuniones donde cada detalle importa.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#contacto"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
            >
              Solicitar presupuesto
              <ArrowRight size={16} />
            </a>

            <a
              href="#servicios"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
            >
              Ver servicios
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
