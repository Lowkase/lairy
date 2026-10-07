import { Button } from "../../button/button";
import { TextInput } from "../../text-input/text-input";
import { Drawer, DrawerBody, DrawerClose, DrawerContent, DrawerHeader, DrawerMeta, DrawerTitle, DrawerTrigger } from "../drawer";

/** Do and don't, pair 1 (bad): never scatter commits through the body — the
 * operator stops knowing what is saved. No pinned footer at all; each field
 * carries its own "Save". */
export function DrawerBadScatteredCommitsExample() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="secondary">Edit pipeline fields</Button>
      </DrawerTrigger>
      <DrawerContent size="md">
        <DrawerHeader>
          <div>
            <DrawerTitle>Pipeline fields</DrawerTitle>
            <DrawerMeta>AUT · 02</DrawerMeta>
          </div>
          <DrawerClose />
        </DrawerHeader>
        <DrawerBody className="flex flex-col gap-12">
          <div className="flex items-end gap-8">
            <div className="flex-1">
              <TextInput label="Source" defaultValue="s3://runs/raw" />
            </div>
            <Button variant="ghost">Save</Button>
          </div>
          <div className="flex items-end gap-8">
            <div className="flex-1">
              <TextInput label="Destination" defaultValue="warehouse.runs" />
            </div>
            <Button variant="ghost">Save</Button>
          </div>
          <div className="flex items-end gap-8">
            <div className="flex-1">
              <TextInput label="Schedule" defaultValue="0 * * * *" />
            </div>
            <Button variant="ghost">Save</Button>
          </div>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
