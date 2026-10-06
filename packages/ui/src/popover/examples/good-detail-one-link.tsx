import { Button } from "../../button/button";
import { Popover, PopoverContent, PopoverDetailLink, PopoverDetailRow, PopoverTrigger } from "../popover";

export function PopoverGoodDetailOneLinkExample() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary">Run 4471</Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverDetailRow label="Started" value="14:22:07" />
        <PopoverDetailRow label="Duration" value="8.4s" />
        <PopoverDetailRow label="Owner" value="Aria" />
        <PopoverDetailLink href="#">Open run →</PopoverDetailLink>
      </PopoverContent>
    </Popover>
  );
}
