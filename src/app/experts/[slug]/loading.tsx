import { DelayedFallback } from "@/components/delayed-fallback";
import { RouteLoadingIndicator } from "@/components/route-loading-indicator";

export default function ExpertProfileLoading() {
  return (
    <DelayedFallback>
      <RouteLoadingIndicator label="Loading expert profile" />
    </DelayedFallback>
  );
}
