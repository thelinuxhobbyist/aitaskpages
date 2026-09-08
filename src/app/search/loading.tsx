import { DelayedFallback } from "@/components/delayed-fallback";
import { RouteLoadingIndicator } from "@/components/route-loading-indicator";

export default function SearchLoading() {
  return (
    <DelayedFallback>
      <RouteLoadingIndicator label="Loading experts" />
    </DelayedFallback>
  );
}
