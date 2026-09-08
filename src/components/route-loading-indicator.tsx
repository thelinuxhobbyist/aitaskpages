/** Minimal loading state for route transitions and short auth checks. */
export function RouteLoadingIndicator({
  label = "Loading",
}: {
  label?: string;
}) {
  return (
    <div
      className="flex min-h-[8rem] items-center justify-center py-10"
      aria-busy="true"
      aria-label={label}
    >
      <div className="h-1 w-24 overflow-hidden rounded-full bg-surface-container-high">
        <div className="h-full w-1/2 animate-pulse rounded-full bg-muted/40" />
      </div>
    </div>
  );
}
