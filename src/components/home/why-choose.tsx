import { HOME_BENEFITS } from "@/lib/home-content";
import { CircleCheck } from "lucide-react";

export function WhyChoose() {
  return (
    <section id="why-choose" className="scroll-mt-20">
      <h2>Why choose AI Jobs Market</h2>
      <p className="mt-3 max-w-lg text-muted">
        A UK platform built for businesses and independent AI professionals —
        simple, direct, and transparent.
      </p>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {HOME_BENEFITS.map((benefit) => (
          <li
            key={benefit.title}
            className="rounded-2xl border border-border bg-card p-6 shadow-soft"
          >
            <div className="flex items-start gap-3">
              <CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-accent-foreground" />
              <div>
                <h3 className="text-base">{benefit.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {benefit.description}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
