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

/** Modal Sizes "SM" (modalSizeData 'sm'): one question, two buttons, no
 * scrolling — destructive confirms and nothing else. */
export function ModalSmExample() {
  return (
    <ModalConfirm>
      <ModalConfirmTrigger asChild>
        <Button variant="secondary">Confirm action</Button>
      </ModalConfirmTrigger>
      <ModalConfirmContent size="sm">
        <ModalHeader>
          <ModalConfirmTitle>Confirm action</ModalConfirmTitle>
        </ModalHeader>
        <ModalConfirmBody>
          One question, two buttons, no scrolling. Use SM for destructive confirms and nothing else.
        </ModalConfirmBody>
        <ModalFooter>
          <ModalConfirmCancel>Cancel</ModalConfirmCancel>
          <ModalConfirmAction>Confirm</ModalConfirmAction>
        </ModalFooter>
      </ModalConfirmContent>
    </ModalConfirm>
  );
}
