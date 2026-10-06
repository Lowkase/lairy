import { Button } from "../../button/button";
import {
  ModalConfirm,
  ModalConfirmAction,
  ModalConfirmBody,
  ModalConfirmCancel,
  ModalConfirmContent,
  ModalConfirmTitle,
  ModalConfirmTrigger,
  ModalFooter,
  ModalHeader,
} from "../modal";

/** Do and don't, pair 1 (bad): never "Are you sure?" with OK — the operator
 * has to guess what OK agrees to. */
export function ModalBadAreYouSureExample() {
  return (
    <ModalConfirm>
      <ModalConfirmTrigger asChild>
        <Button variant="danger">Delete</Button>
      </ModalConfirmTrigger>
      <ModalConfirmContent size="sm">
        <ModalHeader>
          <ModalConfirmTitle>Are you sure?</ModalConfirmTitle>
        </ModalHeader>
        <ModalConfirmBody>This action cannot be undone.</ModalConfirmBody>
        <ModalFooter>
          <ModalConfirmCancel>No</ModalConfirmCancel>
          <ModalConfirmAction>OK</ModalConfirmAction>
        </ModalFooter>
      </ModalConfirmContent>
    </ModalConfirm>
  );
}
