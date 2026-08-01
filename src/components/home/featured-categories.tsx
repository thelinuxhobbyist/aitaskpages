import Link from "next/link";
import { HOME_CATEGORIES } from "@/lib/home-content";
import { ArrowRight } from "lucide-react";

export function FeaturedCategories() {
  return (
    <section id="categories" className="scroll-mt-20 border-y border-border/60 bg-surface-container/60">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <h2>Explore by category</h2>
        <p className="section-lead">
          Find AI experts by discipline — from chatbots to Copilot rollouts and
          machine learning.
        </p>
        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {HOME_CATEGORIES.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="group rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift md:p-7"
            >
              <span className="grid size-10 place-items-center rounded-xl bg-accent-muted text-accent-foreground">
                <category.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4">{category.name}</h3>
              <p className="mt-2.5 text-base leading-[1.65] text-muted">
                {category.description}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-[0.9375rem] font-medium md:text-base">
                Browse experts
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
