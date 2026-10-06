import { Button } from "../../button/button";
import {
  PopoverMenu,
  PopoverMenuContent,
  PopoverMenuItem,
  PopoverMenuSeparator,
  PopoverMenuTrigger,
} from "../popover";

export function PopoverDemoExample() {
  return (
    <PopoverMenu>
      <PopoverMenuTrigger asChild>
        <Button variant="secondary">Actions</Button>
      </PopoverMenuTrigger>
      <PopoverMenuContent>
        <PopoverMenuItem>Rename</PopoverMenuItem>
        <PopoverMenuItem>Duplicate</PopoverMenuItem>
        <PopoverMenuItem>Archive</PopoverMenuItem>
        <PopoverMenuSeparator />
        <PopoverMenuItem destructive>Delete</PopoverMenuItem>
      </PopoverMenuContent>
    </PopoverMenu>
  );
}
