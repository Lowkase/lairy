import { Switch } from "@lairy/ui";
import { SwitchAutoRetryFailedRunsExample } from "@lairy/ui/switch/examples";
import { ThemeToggle } from "../../../components/theme-toggle";

export default function SwitchDevPage() {
  return (
    <ThemeToggle>
      <div className="flex flex-col gap-16">
        <SwitchAutoRetryFailedRunsExample />
        <Switch label="Off" />
        <Switch label="On" defaultChecked />
        <Switch label="Disabled off" disabled />
        <Switch label="Disabled on" disabled defaultChecked />
        <Switch label="With description" description="Retries twice, then stops and notifies" />
      </div>
    </ThemeToggle>
  );
}
