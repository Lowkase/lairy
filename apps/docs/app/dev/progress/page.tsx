import { ProgressBarExample, ProgressMeterExample, ProgressStepsExample } from "@lairy/ui/progress/examples";
import { ThemeToggle } from "../../../components/theme-toggle";

export default function ProgressDevPage() {
  return (
    <ThemeToggle>
      <div className="flex flex-col gap-16">
        <div className="border border-border bg-panel p-18">
          <ProgressBarExample />
        </div>
        <div className="border border-border bg-panel p-18">
          <ProgressStepsExample />
        </div>
        <div className="border border-border bg-panel p-18">
          <ProgressMeterExample />
        </div>
      </div>
    </ThemeToggle>
  );
}
