import {
  ToastBadFilledBackgroundExample,
  ToastBadQuestionExample,
  ToastBadStackedRepeatsExample,
  ToastDemoExample,
  ToastGoodCollapsedRepeatExample,
  ToastGoodFailureLinkExample,
  ToastGoodOutcomeAndRailExample,
  ToastVariantsExample,
} from "@lairy/ui/toast/examples";
import { ThemeToggle } from "../../../components/theme-toggle";

export default function ToastDevPage() {
  return (
    <ThemeToggle>
      <div className="flex flex-wrap items-start gap-32 p-32">
        <ToastDemoExample />
        <ToastVariantsExample />
        <ToastGoodOutcomeAndRailExample />
        <ToastBadFilledBackgroundExample />
        <ToastGoodFailureLinkExample />
        <ToastBadQuestionExample />
        <ToastGoodCollapsedRepeatExample />
        <ToastBadStackedRepeatsExample />
      </div>
    </ThemeToggle>
  );
}
