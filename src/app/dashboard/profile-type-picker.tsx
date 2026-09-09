"use client";

import { Building2, User } from "lucide-react";
import type { ProfileType } from "@/lib/profile-type";

const OPTIONS: {
  type: ProfileType;
  title: string;
  description: string;
  icon: typeof User;
}[] = [
  {
    type: "individual",
    title: "Individual Expert",
    description: "Showcase your personal AI expertise and experience.",
    icon: User,
  },
  {
    type: "company",
    title: "Company",
    description: "Showcase your company's AI capabilities and team.",
    icon: Building2,
  },
];

export function ProfileTypePicker({
  onSelect,
  onCancel,
}: {
  onSelect: (type: ProfileType) => void;
  onCancel?: () => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold text-secondary">
          What type of profile do you want?
        </h3>
        <p className="mt-1 text-sm text-muted">
          Choose how you appear in Find AI Expertise. You can switch between
          Individual and Company later from your dashboard.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {OPTIONS.map((option) => {
          const Icon = option.icon;
          return (
            <button
              key={option.type}
              type="button"
              onClick={() => onSelect(option.type)}
              className="group rounded-xl border border-border bg-surface p-5 text-left transition-shadow hover:border-primary/30 hover:shadow-md"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <p className="mt-3 font-semibold text-secondary group-hover:text-primary">
                {option.title}
              </p>
              <p className="mt-1 text-sm text-muted">{option.description}</p>
            </button>
          );
        })}
      </div>

      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="text-sm font-medium text-muted hover:text-primary hover:underline"
        >
          Cancel
        </button>
      )}
    </div>
  );
}
