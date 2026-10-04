import { TableAutomationsDemoExample } from "@lairy/ui/table/examples";
import { ThemeToggle } from "../../../components/theme-toggle";

export default function TableDevPage() {
  return (
    <ThemeToggle>
      <div className="flex flex-col gap-16">
        <TableAutomationsDemoExample />
      </div>
    </ThemeToggle>
  );
}
