import {
  BadgeFailExample,
  BadgeInfoExample,
  BadgeNeutralExample,
  BadgeSuccessExample,
} from "@lairy/ui/badge/examples";
import { ThemeToggle } from "../../../components/theme-toggle";

export default function BadgeDevPage() {
  return (
    <ThemeToggle>
      <div className="flex flex-wrap items-center gap-16">
        <BadgeNeutralExample />
        <BadgeInfoExample />
        <BadgeSuccessExample />
        <BadgeFailExample />
      </div>
    </ThemeToggle>
  );
}
