import { Button } from "../../button/button";
import { TextInput } from "../../text-input/text-input";
import { Drawer, DrawerAction, DrawerBody, DrawerCancel, DrawerClose, DrawerContent, DrawerHeader, DrawerFooter, DrawerMeta, DrawerTitle, DrawerTrigger } from "../drawer";

/** Do and don't, pair 1 (good): the commit lives in a pinned footer, so it
 * survives any length of scroll. */
export function DrawerGoodPinnedFooterExample() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="secondary">Edit workflow settings</Button>
      </DrawerTrigger>
      <DrawerContent size="md">
        <DrawerHeader>
          <div>
            <DrawerTitle>Workflow settings</DrawerTitle>
            <DrawerMeta>AUT · 02</DrawerMeta>
          </div>
          <DrawerClose />
        </DrawerHeader>
        <DrawerBody className="flex flex-col gap-12">
          <TextInput label="Name" defaultValue="rebalance" />
          <TextInput label="Schedule" defaultValue="0 * * * *" />
          <TextInput label="Owner" defaultValue="aria" />
          <TextInput label="Retries" defaultValue="3" />
          <TextInput label="Timeout" defaultValue="900" />
        </DrawerBody>
        <DrawerFooter>
          <DrawerCancel>Cancel</DrawerCancel>
          <DrawerAction>Save changes</DrawerAction>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
