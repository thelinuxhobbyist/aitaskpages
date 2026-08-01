const STEPS = [
  {
    number: "01",
    title: "Search experts or post a task",
    description:
      "Browse AI consultants across the UK, or describe your project and let matching experts come to you.",
  },
  {
    number: "02",
    title: "Connect directly",
    description:
      "Express interest, receive enquiries, or start a conversation — all on AI Jobs Market.",
  },
  {
    number: "03",
    title: "Work together",
    description:
      "Agree terms directly. We stay out of contracts, payments and project delivery.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20">
      <h2>How AI Jobs Market works</h2>
      <p className="section-lead">
        Search experts, post a task, or browse jobs — then connect directly on
        the platform.
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
