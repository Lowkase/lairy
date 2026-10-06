import { Button } from "../../button/button";
import {
  PopoverMenu,
  PopoverMenuContent,
  PopoverMenuItem,
  PopoverMenuSeparator,
  PopoverMenuTrigger,
} from "../popover";

export function PopoverGoodDestructiveBelowDividerExample() {
  return (
    <PopoverMenu>
      <PopoverMenuTrigger asChild>
        <Button variant="secondary">Actions</Button>
      </PopoverMenuTrigger>
      <PopoverMenuContent>
        <PopoverMenuItem>Rename</PopoverMenuItem>
        <PopoverMenuItem>Duplicate</PopoverMenuItem>
        <PopoverMenuSeparator />
        <PopoverMenuItem destructive>Delete</PopoverMenuItem>
      </PopoverMenuContent>
    </PopoverMenu>
  );
}
