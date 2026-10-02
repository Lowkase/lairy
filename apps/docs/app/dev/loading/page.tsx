import {
  LoadingInlineCaretExample,
  LoadingSkeletonExample,
  LoadingSweepStackExample,
} from "@lairy/ui/loading/examples";
import { ThemeToggle } from "../../../components/theme-toggle";

export default function LoadingDevPage() {
  return (
    <ThemeToggle>
      <div className="flex flex-col gap-16">
        <div className="border border-border bg-panel p-18">
          <LoadingSweepStackExample />
        </div>
        <div className="border border-border bg-panel p-18">
          <LoadingSkeletonExample />
        </div>
        <div className="border border-border bg-panel p-18">
          <LoadingInlineCaretExample />
        </div>
      </div>
    </ThemeToggle>
  );
}
