import Link from "next/link";
import { HOME_CATEGORIES } from "@/lib/home-content";
import { ArrowRight } from "lucide-react";

export function FeaturedCategories() {
  return (
    <section id="categories" className="scroll-mt-20">
      <div className="mb-6">
        <h2 className="text-xl font-semibold tracking-tight text-secondary md:text-2xl">
          Explore by category
        </h2>
        <p className="mt-1 max-w-2xl text-sm text-muted md:text-base">
          Find AI experts by discipline — whether you need a chatbot, Copilot
          rollout, or machine learning specialist.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {HOME_CATEGORIES.map((category) => (
          <Link
            key={category.name}
            href={category.href}
            className="group flex flex-col rounded-xl border border-border bg-surface p-5 transition-shadow hover:border-primary/30 hover:shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <category.icon className="h-5 w-5" />
            </div>
            <p className="mt-4 font-semibold text-secondary group-hover:text-primary">
              {category.name}
            </p>
            <p className="mt-1 flex-1 text-sm leading-relaxed text-muted">
              {category.description}
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
              Browse experts
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
