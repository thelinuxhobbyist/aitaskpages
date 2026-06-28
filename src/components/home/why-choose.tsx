import { HOME_BENEFITS } from "@/lib/home-content";
import { CheckCircle2 } from "lucide-react";

export function WhyChoose() {
  return (
    <section id="why-choose" className="scroll-mt-20">
      <div className="mb-6 text-center md:mb-8">
        <h2 className="text-xl font-semibold tracking-tight text-secondary md:text-2xl">
          Why choose AI Jobs Market
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-muted md:text-base">
          A UK platform built for businesses and independent AI professionals —
          simple, direct, and transparent.
        </p>
      </div>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {HOME_BENEFITS.map((benefit) => (
          <li
            key={benefit.title}
            className="rounded-xl border border-border bg-surface-container/50 p-5"
          >
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div>
                <p className="font-semibold text-secondary">{benefit.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">
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
