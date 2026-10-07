import { Button } from "../../button/button";
import {
  Drawer,
  DrawerAction,
  DrawerBody,
  DrawerCancel,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerMeta,
  DrawerTitle,
  DrawerTrigger,
} from "../drawer";

/** The anatomy diagram's own illustrative content (archive/v1 line 12220
 * onward): title "Details", meta "AUT·02", a short property list, footer
 * Cancel/Save. */
export function DrawerDemoExample() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="secondary">Inspect run</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <div>
            <DrawerTitle>Details</DrawerTitle>
            <DrawerMeta>AUT · 02</DrawerMeta>
          </div>
          <DrawerClose />
        </DrawerHeader>
        <DrawerBody className="flex flex-col gap-12">
          <p>Owner: aria</p>
          <p>Schedule: 0 * * * *</p>
          <p>Last run: 214 runs, none failed</p>
        </DrawerBody>
        <DrawerFooter>
          <DrawerCancel>Cancel</DrawerCancel>
          <DrawerAction>Save</DrawerAction>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
