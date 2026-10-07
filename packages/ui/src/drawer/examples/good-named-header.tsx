import { Button } from "../../button/button";
import { Drawer, DrawerAction, DrawerBody, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerMeta, DrawerTitle, DrawerTrigger } from "../drawer";

/** Do and don't, pair 3 (good): a header that names the record, with the
 * close glyph in its own corner. */
export function DrawerGoodNamedHeaderExample() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="secondary">View record</Button>
      </DrawerTrigger>
      <DrawerContent size="sm">
        <DrawerHeader>
          <div>
            <DrawerTitle>Details</DrawerTitle>
            <DrawerMeta>AUT · 02</DrawerMeta>
          </div>
          <DrawerClose />
        </DrawerHeader>
        <DrawerBody>
          <p>Status: Healthy</p>
        </DrawerBody>
        <DrawerFooter>
          <DrawerAction>Close</DrawerAction>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
