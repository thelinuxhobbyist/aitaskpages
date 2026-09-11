const STEPS = [
  {
    number: "01",
    title: "Find an expert, a company, or post a task",
    description:
      "Search for AI expertise and contact someone directly, or post what you need and let relevant specialists express their interest.",
  },
  {
    number: "02",
    title: "Review who is interested",
    description:
      "When you post a task, AI professionals and companies can express interest. Review their profiles and decide who you'd like to speak with.",
  },
  {
    number: "03",
    title: "Connect directly",
    description:
      "Compare profiles, shortlist the people who look right for your needs, and connect directly. Agree the details between yourselves — we make the introduction, not the arrangement.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20">
      <h2>How AI Task Pages works</h2>
      <div className="mt-9 grid gap-4 md:grid-cols-3">
        {STEPS.map((step) => (
          <div
            key={step.number}
            className="rounded-2xl border border-border bg-card p-6 shadow-soft md:p-7"
          >
            <span className="text-[0.9375rem] font-bold text-accent-foreground">
              {step.number}
            </span>
            <h3 className="mt-3.5">{step.title}</h3>
            <p className="mt-2.5 text-base leading-[1.65] text-muted">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
