import { Button } from "../../button/button";
import { Drawer, DrawerAction, DrawerBody, DrawerCancel, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerMeta, DrawerTitle, DrawerTrigger } from "../drawer";

/** Drawer Sizes "LG" (drawerSizeData 'lg'): dense editing — multi-section
 * forms, a nested list plus its editor, or a config with a live preview.
 * Two columns are allowed at this size only; the primary action stays
 * pinned to the footer so it survives long scrolls. */
export function DrawerLgExample() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="secondary">Configure pipeline</Button>
      </DrawerTrigger>
      <DrawerContent size="lg">
        <DrawerHeader>
          <div>
            <DrawerTitle>Configure pipeline</DrawerTitle>
            <DrawerMeta>LG · 720px · DENSE EDITING</DrawerMeta>
          </div>
          <DrawerClose />
        </DrawerHeader>
        <DrawerBody>
          <p>
            For dense editing: multi-section forms, a nested list plus its editor, or a config with a
            live preview.
          </p>
          <p className="mt-16">
            720px wide. Two columns are allowed at this size only; keep the primary action pinned to the
            footer so it survives long scrolls.
          </p>
        </DrawerBody>
        <DrawerFooter>
          <DrawerCancel>Cancel</DrawerCancel>
          <DrawerAction>Save changes</DrawerAction>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
