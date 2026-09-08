import { DelayedFallback } from "@/components/delayed-fallback";
import { RouteLoadingIndicator } from "@/components/route-loading-indicator";

export default function TaskDetailLoading() {
  return (
    <DelayedFallback>
      <RouteLoadingIndicator label="Loading task" />
    </DelayedFallback>
  );
}
