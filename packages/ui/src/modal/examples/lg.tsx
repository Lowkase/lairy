import { Button } from "../../button/button";
import { Modal, ModalAction, ModalBody, ModalCancel, ModalClose, ModalContent, ModalFooter, ModalHeader, ModalTitle, ModalTrigger } from "../modal";

/** Modal Sizes "LG" (modalSizeData 'lg'): dense content that must stay
 * modal — side-by-side comparisons, a table of affected records, a diff.
 * Body scrolls internally; header and footer stay pinned. */
export function ModalLgExample() {
  return (
    <Modal>
      <ModalTrigger asChild>
        <Button variant="secondary">Review changes</Button>
      </ModalTrigger>
      <ModalContent size="lg">
        <ModalHeader>
          <ModalTitle>Review changes</ModalTitle>
          <ModalClose />
        </ModalHeader>
        <ModalBody>
          <p>
            For dense content that must stay modal: side-by-side comparisons, a table of affected
            records, a diff.
          </p>
          <p className="mt-16">
            Past this size, use a full page. The body scrolls internally; the header and footer stay
            pinned.
          </p>
        </ModalBody>
        <ModalFooter>
          <ModalCancel>Cancel</ModalCancel>
          <ModalAction>Apply changes</ModalAction>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
