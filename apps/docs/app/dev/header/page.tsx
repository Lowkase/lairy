import {
  HeaderBadAccentClockExample,
  HeaderBadFourthZoneExample,
  HeaderDemoExample,
  HeaderGoodAmbientGreyExample,
  HeaderGoodChromeOnlyExample,
} from "@lairy/ui/header/examples";
import { ThemeToggle } from "../../../components/theme-toggle";

export default function HeaderDevPage() {
  return (
    <ThemeToggle>
      <div className="flex flex-col gap-16">
        <HeaderDemoExample />
        <HeaderGoodChromeOnlyExample />
        <HeaderBadFourthZoneExample />
        <HeaderGoodAmbientGreyExample />
        <HeaderBadAccentClockExample />
      </div>
    </ThemeToggle>
  );
}
