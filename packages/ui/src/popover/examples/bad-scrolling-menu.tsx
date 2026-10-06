import { Button } from "../../button/button";
import { PopoverMenu, PopoverMenuContent, PopoverMenuItem, PopoverMenuTrigger } from "../popover";

export function PopoverBadScrollingMenuExample() {
  return (
    <PopoverMenu>
      <PopoverMenuTrigger asChild>
        <Button variant="secondary">Actions</Button>
      </PopoverMenuTrigger>
      <PopoverMenuContent className="h-44 overflow-y-auto">
        <PopoverMenuItem>Rename</PopoverMenuItem>
        <PopoverMenuItem>Duplicate</PopoverMenuItem>
        <PopoverMenuItem>Archive</PopoverMenuItem>
        <PopoverMenuItem>Move</PopoverMenuItem>
        <PopoverMenuItem>Share</PopoverMenuItem>
        <PopoverMenuItem>Export</PopoverMenuItem>
        <PopoverMenuItem destructive>Delete</PopoverMenuItem>
      </PopoverMenuContent>
    </PopoverMenu>
  );
}
