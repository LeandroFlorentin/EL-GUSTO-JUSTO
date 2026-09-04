const ServiceCardSkeleton = () => {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-border bg-surface animate-pulse">
      <div className="h-48 w-full bg-background-secondary" />

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div>
          <div className="h-6 w-2/3 rounded bg-background-secondary" />
          <div className="mt-3 h-4 w-full rounded bg-background-secondary" />
          <div className="mt-2 h-4 w-5/6 rounded bg-background-secondary" />
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="h-6 w-16 rounded-full bg-background-secondary" />
          <div className="h-6 w-20 rounded-full bg-background-secondary" />
          <div className="h-6 w-14 rounded-full bg-background-secondary" />
        </div>

        <div className="h-3 w-1/3 rounded bg-background-secondary" />

        <div className="mt-auto flex items-center justify-between gap-4 pt-2">
          <div className="h-9 w-24 rounded-full bg-background-secondary" />
          <div className="h-9 w-32 rounded-full bg-background-secondary" />
        </div>
      </div>
    </article>
  );
};

export default ServiceCardSkeleton;
