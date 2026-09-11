import type { ReactNode } from "react";

export function SuccessBanner({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) {
  return (
    <div
      role="status"
      className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
    >
      <p className="font-medium">{title}</p>
      {children ? <div className="mt-1 text-emerald-800">{children}</div> : null}
    </div>
  );
}
