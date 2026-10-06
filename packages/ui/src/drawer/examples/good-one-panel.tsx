import { Button } from "../../button/button";
import { Drawer, DrawerAction, DrawerBody, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerMeta, DrawerTitle, DrawerTrigger } from "../drawer";

/** Do and don't, pair 2 (good): one panel, and the work behind it still
 * legible through a dimming scrim. */
export function DrawerGoodOnePanelExample() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="secondary">View row details</Button>
      </DrawerTrigger>
      <DrawerContent size="sm">
        <DrawerHeader>
          <div>
            <DrawerTitle>Row</DrawerTitle>
            <DrawerMeta>AUT · 02</DrawerMeta>
          </div>
          <DrawerClose />
        </DrawerHeader>
        <DrawerBody className="flex flex-col gap-12">
          <p>Status: Healthy</p>
          <p>Owner: aria</p>
        </DrawerBody>
        <DrawerFooter>
          <DrawerAction>Close</DrawerAction>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
