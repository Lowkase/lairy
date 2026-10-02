import {
  CardHudExample,
  CardPlainExample,
  CardStatExample,
  CardTileExample,
  CardWithHeaderExample,
} from "@lairy/ui/card/examples";
import { ThemeToggle } from "../../../components/theme-toggle";

export default function CardDevPage() {
  return (
    <ThemeToggle>
      <div className="flex flex-col gap-16">
        <CardPlainExample />
        <CardWithHeaderExample />
        <CardHudExample />
        <CardStatExample />
        <CardTileExample />
      </div>
    </ThemeToggle>
  );
}
