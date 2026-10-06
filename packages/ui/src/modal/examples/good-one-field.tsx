import { Button } from "../../button/button";
import { TextInput } from "../../text-input/text-input";
import { Modal, ModalAction, ModalBody, ModalCancel, ModalClose, ModalContent, ModalFooter, ModalHeader, ModalTitle, ModalTrigger } from "../modal";

/** Do and don't, pair 3 (good): one field is fine — a single input is still
 * one decision. */
export function ModalGoodOneFieldExample() {
  return (
    <Modal>
      <ModalTrigger asChild>
        <Button variant="secondary">Rename</Button>
      </ModalTrigger>
      <ModalContent size="md">
        <ModalHeader>
          <ModalTitle>Rename workflow</ModalTitle>
          <ModalClose />
        </ModalHeader>
        <ModalBody>
          <TextInput label="Name" defaultValue="rebalance" />
        </ModalBody>
        <ModalFooter>
          <ModalCancel>Cancel</ModalCancel>
          <ModalAction>Rename</ModalAction>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
