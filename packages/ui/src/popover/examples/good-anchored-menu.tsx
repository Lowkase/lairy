import { Button } from "../../button/button";
import { PopoverMenu, PopoverMenuContent, PopoverMenuItem, PopoverMenuTrigger } from "../popover";

export function PopoverGoodAnchoredMenuExample() {
  return (
    <PopoverMenu>
      <PopoverMenuTrigger asChild>
        <Button variant="secondary">Actions</Button>
      </PopoverMenuTrigger>
      <PopoverMenuContent>
        <PopoverMenuItem>Rename</PopoverMenuItem>
        <PopoverMenuItem>Archive</PopoverMenuItem>
      </PopoverMenuContent>
    </PopoverMenu>
  );
}
