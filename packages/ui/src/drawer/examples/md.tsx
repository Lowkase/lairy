import { Button } from "../../button/button";
import { Drawer, DrawerAction, DrawerBody, DrawerCancel, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerMeta, DrawerTitle, DrawerTrigger } from "../drawer";

/** Drawer Sizes "MD" (drawerSizeData 'md'): the default. Detail, settings
 * and editing — anything where the page behind stays relevant. */
export function DrawerMdExample() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="secondary">Edit workflow</Button>
      </DrawerTrigger>
      <DrawerContent size="md">
        <DrawerHeader>
          <div>
            <DrawerTitle>Drawer</DrawerTitle>
            <DrawerMeta>MD · 480px · SECONDARY SURFACE</DrawerMeta>
          </div>
          <DrawerClose />
        </DrawerHeader>
        <DrawerBody>
          The default. Detail, settings and editing — anything where the page behind stays relevant.
        </DrawerBody>
        <DrawerFooter>
          <DrawerCancel>Cancel</DrawerCancel>
          <DrawerAction>Save</DrawerAction>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
