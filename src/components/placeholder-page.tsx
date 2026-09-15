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
          This page is not available yet
        </p>
        <p className="mt-2 text-sm text-muted">
          Browse{" "}
          <a href="/search" className="font-medium text-primary underline">
            AI experts
          </a>{" "}
          or{" "}
          <a href="/tasks" className="font-medium text-primary underline">
            AI tasks
          </a>{" "}
          on the live platform.
        </p>
      </div>
    </div>
  );
}
