import { Button } from "../../button/button";
import { Drawer, DrawerAction, DrawerBody, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerMeta, DrawerTitle, DrawerTrigger } from "../drawer";

/** Drawer Sizes "SM" (drawerSizeData 'sm'): a read-only detail panel —
 * properties, metadata, a short activity list. One column, labels above
 * values, no nested panels. Nothing here is edited, so the footer holds a
 * single "Close" rather than a Cancel/commit pair — there is nothing to
 * lose. */
export function DrawerSmExample() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="secondary">View details</Button>
      </DrawerTrigger>
      <DrawerContent size="sm">
        <DrawerHeader>
          <div>
            <DrawerTitle>Details</DrawerTitle>
            <DrawerMeta>SM · 360px</DrawerMeta>
          </div>
          <DrawerClose />
        </DrawerHeader>
        <DrawerBody className="flex flex-col gap-12">
          <p>A read-only detail panel — properties, metadata, a short activity list.</p>
          <p>Owner: aria</p>
          <p>Created: 11 Aug 2026</p>
        </DrawerBody>
        <DrawerFooter>
          <DrawerAction>Close</DrawerAction>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
