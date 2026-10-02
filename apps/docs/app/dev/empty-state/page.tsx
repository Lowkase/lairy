import {
  EmptyStateFirstRunExample,
  EmptyStateNoResultsExample,
  EmptyStateRestrictedExample,
} from "@lairy/ui/empty-state/examples";
import { ThemeToggle } from "../../../components/theme-toggle";

export default function EmptyStateDevPage() {
  return (
    <ThemeToggle>
      <div className="flex flex-col gap-16">
        <div className="border border-border bg-panel">
          <EmptyStateFirstRunExample />
        </div>
        <div className="border border-border bg-panel">
          <EmptyStateNoResultsExample />
        </div>
        <div className="border border-border bg-panel">
          <EmptyStateRestrictedExample />
        </div>
      </div>
    </ThemeToggle>
  );
}
