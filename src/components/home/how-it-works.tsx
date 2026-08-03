const STEPS = [
  {
    number: "01",
    title: "Find experts or post a task",
    description:
      "Search the UK AI expert directory for consulting, automation, integrations and machine learning — or describe your project so matching experts can find you.",
  },
  {
    number: "02",
    title: "Experts express interest",
    description:
      "Independent AI professionals review open tasks and register interest. You see who wants the work before you start a conversation.",
  },
  {
    number: "03",
    title: "Review and connect directly",
    description:
      "Compare profiles, shortlist the right people, and message them on AI Jobs Market. Agree terms yourselves — no platform fees on the work.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20">
      <h2>How AI Jobs Market works</h2>
      <p className="section-lead">
        A marketplace for AI expertise — not a traditional job board. Find
        specialists, post requirements, and connect directly.
      </p>
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
