import {
  UsageCardBadSingleExample,
  UsageCardGoodPairExample,
  UsageCardPairExample,
} from "@lairy/ui/usage-card/examples";
import { ThemeToggle } from "../../../components/theme-toggle";

export default function UsageCardDevPage() {
  return (
    <ThemeToggle>
      <div className="flex flex-col gap-16">
        <UsageCardPairExample />
        <UsageCardGoodPairExample />
        <UsageCardBadSingleExample />
      </div>
    </ThemeToggle>
  );
}
