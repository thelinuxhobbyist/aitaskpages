import { DelayedFallback } from "@/components/delayed-fallback";
import { RouteLoadingIndicator } from "@/components/route-loading-indicator";

export default function PostTaskLoading() {
  return (
    <DelayedFallback>
      <RouteLoadingIndicator label="Loading post a task" />
    </DelayedFallback>
  );
}
