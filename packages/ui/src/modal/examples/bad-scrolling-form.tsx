import { Button } from "../../button/button";
import { TextInput } from "../../text-input/text-input";
import { Modal, ModalAction, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalTitle, ModalTrigger } from "../modal";

/** Do and don't, pair 3 (bad): never a scrolling form in a modal — if it
 * needs sections, it needed a drawer. */
export function ModalBadScrollingFormExample() {
  return (
    <Modal>
      <ModalTrigger asChild>
        <Button variant="secondary">Configure</Button>
      </ModalTrigger>
      <ModalContent size="md">
        <ModalHeader>
          <ModalTitle>Configure pipeline</ModalTitle>
        </ModalHeader>
        <ModalBody className="flex flex-col gap-12">
          <TextInput label="Source" defaultValue="s3://runs/raw" />
          <TextInput label="Destination" defaultValue="warehouse.runs" />
          <TextInput label="Schedule" defaultValue="0 * * * *" />
          <TextInput label="Retries" defaultValue="3" />
          <TextInput label="Timeout" defaultValue="900" />
          <TextInput label="Owner" defaultValue="aria" />
        </ModalBody>
        <ModalFooter>
          <ModalAction>Save</ModalAction>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
