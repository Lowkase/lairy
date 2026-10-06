import { Button } from "../../button/button";
import { TextInput } from "../../text-input/text-input";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";

export function PopoverBadDetailFormExample() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary">Edit</Button>
      </PopoverTrigger>
      <PopoverContent>
        <TextInput label="Name" defaultValue="nightly-ingest" />
        <TextInput label="Owner" defaultValue="Aria" />
        <div className="flex justify-end gap-8">
          <Button variant="ghost">Cancel</Button>
          <Button variant="primary">Save</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
