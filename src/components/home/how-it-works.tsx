import { Search, MessageSquare, Handshake } from "lucide-react";

const STEPS = [
  {
    icon: Search,
    title: "Search experts or post a task",
    description:
      "Browse AI consultants across the UK, or describe your project and let matching experts come to you.",
  },
  {
    icon: MessageSquare,
    title: "Connect directly",
    description:
      "Express interest, receive enquiries, or start a conversation — all on AI Jobs Market.",
  },
  {
    icon: Handshake,
    title: "Work together",
    description:
      "Agree terms directly. We provide the platform — not contracts, payments, or project delivery.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 rounded-2xl border border-border bg-surface-container/60 px-6 py-10 md:px-10">
      <div className="mb-8 text-center">
        <h2 className="text-xl font-semibold tracking-tight text-secondary md:text-2xl">
          How AI Jobs Market works
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-muted md:text-base">
          Whether you need an expert today or want to explore opportunities,
          the platform is built around simple, direct connections.
        </p>
      </div>
      <ol className="grid gap-8 md:grid-cols-3 md:gap-6">
        {STEPS.map((step, index) => (
          <li key={step.title} className="relative text-center md:text-left">
            {index < STEPS.length - 1 && (
              <span
                aria-hidden
                className="absolute left-[calc(50%+2rem)] top-6 hidden h-px w-[calc(100%-4rem)] bg-border md:block"
              />
            )}
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary md:mx-0">
              <step.icon className="h-5 w-5" />
            </div>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-primary">
              Step {index + 1}
            </p>
            <h3 className="mt-1 font-semibold text-secondary">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {step.description}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
