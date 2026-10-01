import { Button } from "@lairy/ui";
import {
  ButtonDangerExample,
  ButtonGhostExample,
  ButtonPrimaryExample,
  ButtonSecondaryExample,
} from "@lairy/ui/button/examples";
import { ThemeToggle } from "../../../components/theme-toggle";

export default function ButtonDevPage() {
  return (
    <ThemeToggle>
      <div className="flex flex-wrap items-center gap-16">
        <ButtonPrimaryExample />
        <ButtonSecondaryExample />
        <ButtonGhostExample />
        <ButtonDangerExample />
        <Button variant="primary" disabled>
          Delete workspace
        </Button>
      </div>
    </ThemeToggle>
  );
}
