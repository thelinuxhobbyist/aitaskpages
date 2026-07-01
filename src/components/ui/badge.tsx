import { cn } from "@/lib/utils";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "secondary" | "featured";
};

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium",
        variant === "default" &&
          "bg-stone-100 text-stone-700 ring-1 ring-stone-200/80",
        variant === "secondary" &&
          "bg-neutral-100 text-neutral-700 ring-1 ring-neutral-200/80",
        variant === "featured" && "bg-amber-100 text-amber-800 ring-1 ring-amber-200/80",
        className
      )}
      {...props}
    />
  );
}
