import {
  TooltipBadAlreadyLabelledExample,
  TooltipBadConstraintBehindTooltipExample,
  TooltipBadParagraphWithLinkExample,
  TooltipDemoExample,
  TooltipGoodConstraintInHintExample,
  TooltipGoodNameAndShortcutExample,
  TooltipGoodTruncatedValueExample,
} from "@lairy/ui/tooltip/examples";
import { ThemeToggle } from "../../../components/theme-toggle";

export default function TooltipDevPage() {
  return (
    <ThemeToggle>
      <div className="flex flex-col gap-32 p-32">
        <TooltipDemoExample />
        <TooltipGoodNameAndShortcutExample />
        <TooltipBadParagraphWithLinkExample />
        <TooltipGoodConstraintInHintExample />
        <TooltipBadConstraintBehindTooltipExample />
        <TooltipGoodTruncatedValueExample />
        <TooltipBadAlreadyLabelledExample />
      </div>
    </ThemeToggle>
  );
}
