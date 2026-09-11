import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SuccessBanner({
  title,
  children,
  className,
}: {
  title: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div
      role="status"
      className={cn(
        "rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900",
        className
      )}
    >
      <p className="font-medium">{title}</p>
      {children ? <div className="mt-1 text-emerald-800">{children}</div> : null}
    </div>
  );
}
