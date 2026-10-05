import {
  SubnavBadIndentOnlyExample,
  SubnavBadThirdLevelExample,
  SubnavDemoExample,
  SubnavGoodCaseSignalsLevelExample,
  SubnavGoodOneSectionOpenExample,
} from "@lairy/ui/subnav/examples";
import { ThemeToggle } from "../../../components/theme-toggle";

export default function SubnavDevPage() {
  return (
    <ThemeToggle>
      <div className="flex flex-col gap-16">
        <SubnavDemoExample />
        <SubnavGoodOneSectionOpenExample />
        <SubnavBadThirdLevelExample />
        <SubnavGoodCaseSignalsLevelExample />
        <SubnavBadIndentOnlyExample />
      </div>
    </ThemeToggle>
  );
}
