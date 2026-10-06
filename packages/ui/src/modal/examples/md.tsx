import { Button } from "../../button/button";
import { Modal, ModalAction, ModalBody, ModalCancel, ModalClose, ModalContent, ModalFooter, ModalHeader, ModalTitle, ModalTrigger } from "../modal";

/** Modal Sizes "MD" (modalSizeData 'md'): the default. Fits a short form —
 * up to six fields — or a decision that needs a paragraph of context. */
export function ModalMdExample() {
  return (
    <Modal>
      <ModalTrigger asChild>
        <Button variant="secondary">Edit workflow</Button>
      </ModalTrigger>
      <ModalContent size="md">
        <ModalHeader>
          <ModalTitle>Edit workflow</ModalTitle>
          <ModalClose />
        </ModalHeader>
        <ModalBody>
          The default. Fits a short form — up to six fields — or a decision that needs a paragraph of
          context. If it starts to scroll, it belongs in a drawer.
        </ModalBody>
        <ModalFooter>
          <ModalCancel>Cancel</ModalCancel>
          <ModalAction>Save</ModalAction>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
