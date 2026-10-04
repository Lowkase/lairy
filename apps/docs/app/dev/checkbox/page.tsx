import { Checkbox } from "@lairy/ui";
import { CheckboxRetryFailedStepsExample } from "@lairy/ui/checkbox/examples";
import { ThemeToggle } from "../../../components/theme-toggle";

export default function CheckboxDevPage() {
  return (
    <ThemeToggle>
      <div className="flex flex-col gap-16">
        <CheckboxRetryFailedStepsExample />
        <Checkbox label="Off" />
        <Checkbox label="Indeterminate" indeterminate />
        <Checkbox label="Error" error />
        <Checkbox label="Disabled off" disabled />
        <Checkbox label="Disabled on" disabled defaultChecked />
        <Checkbox label="With description" description="Monday 09:00, to every workspace owner." />
      </div>
    </ThemeToggle>
  );
}
