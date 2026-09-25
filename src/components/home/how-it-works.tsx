const STEPS = [
  {
    number: "01",
    title: "Find expertise or post a task",
    description:
      "Search AI professionals and companies, or describe what you need and invite interest.",
  },
  {
    number: "02",
    title: "Review who responds",
    description:
      "See who expresses interest, compare profiles, and decide who to speak with.",
  },
  {
    number: "03",
    title: "Connect and agree directly",
    description:
      "We make the introduction. You connect directly and agree the details between yourselves — AI Task Pages does not handle contracts, payments, commissions, or project delivery.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20">
      <h2>How AI Task Pages works</h2>
      <p className="section-lead">
        An introduction platform. After the introduction, the arrangement is
        between you.
      </p>
      <div className="mt-9 grid gap-6 md:grid-cols-3 md:gap-8">
        {STEPS.map((step) => (
          <div key={step.number} className="border-t border-border pt-5">
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
