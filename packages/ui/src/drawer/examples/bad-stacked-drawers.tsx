import { Button } from "../../button/button";
import { Drawer, DrawerAction, DrawerBody, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerMeta, DrawerTitle, DrawerTrigger } from "../drawer";

/** Do and don't, pair 2 (bad): never stack a drawer on a drawer — the
 * second one has no way back that reads as one. */
export function DrawerBadStackedDrawersExample() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="secondary">Open row</Button>
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
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="secondary">View owner</Button>
            </DrawerTrigger>
            <DrawerContent size="sm">
              <DrawerHeader>
                <div>
                  <DrawerTitle>Owner</DrawerTitle>
                  <DrawerMeta>OPR · 14</DrawerMeta>
                </div>
                <DrawerClose />
              </DrawerHeader>
              <DrawerBody>
                <p>Name: aria</p>
              </DrawerBody>
              <DrawerFooter>
                <DrawerAction>Close</DrawerAction>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </DrawerBody>
        <DrawerFooter>
          <DrawerAction>Close</DrawerAction>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
