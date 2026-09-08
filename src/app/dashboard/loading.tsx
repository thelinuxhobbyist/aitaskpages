import { DelayedFallback } from "@/components/delayed-fallback";
import { RouteLoadingIndicator } from "@/components/route-loading-indicator";

export default function DashboardLoading() {
  return (
    <DelayedFallback>
      <RouteLoadingIndicator label="Loading dashboard" />
    </DelayedFallback>
  );
}
