import { Button } from "../../button/button";
import { PopoverMenu, PopoverMenuContent, PopoverMenuItem, PopoverMenuTrigger } from "../popover";

export function PopoverBadDestructiveFirstExample() {
  return (
    <PopoverMenu>
      <PopoverMenuTrigger asChild>
        <Button variant="secondary">Actions</Button>
      </PopoverMenuTrigger>
      <PopoverMenuContent>
        <PopoverMenuItem destructive>Delete</PopoverMenuItem>
        <PopoverMenuItem>Rename</PopoverMenuItem>
        <PopoverMenuItem>Duplicate</PopoverMenuItem>
      </PopoverMenuContent>
    </PopoverMenu>
  );
}
