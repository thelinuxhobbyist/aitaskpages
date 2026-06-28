type PlaceholderPageProps = {
  title: string;
  intro?: string;
};

export function PlaceholderPage({ title, intro }: PlaceholderPageProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold text-secondary md:text-4xl">{title}</h1>
      {intro && <p className="mt-3 text-muted">{intro}</p>}
      <div className="mt-10 rounded-lg border border-dashed border-border bg-surface px-6 py-12 text-center">
        <p className="text-base font-medium text-on-surface">
          Content coming soon
        </p>
        <p className="mt-2 text-sm text-muted">
          We&apos;re putting the finishing touches on this page. Check back
          shortly.
        </p>
      </div>
    </div>
  );
}
