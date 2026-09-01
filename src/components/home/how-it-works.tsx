const STEPS = [
  {
    number: "01",
    title: "Find an expert or post a task",
    description:
      "Businesses can either search the AI expert directory and contact an expert directly, or post an AI task and let relevant experts discover it and express interest.",
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
        A place where AI work meets AI expertise. Find AI specialists
        directly, or post something you need done and let interested experts
        come to you. Connect directly and decide what happens next.
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
