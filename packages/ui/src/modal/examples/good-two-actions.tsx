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

/** Do and don't, pair 2 (good): two ways out, one of them primary, and no
 * third path competing. */
export function ModalGoodTwoActionsExample() {
  return (
    <ModalConfirm>
      <ModalConfirmTrigger asChild>
        <Button variant="danger">Stop all runs</Button>
      </ModalConfirmTrigger>
      <ModalConfirmContent size="sm">
        <ModalHeader>
          <ModalConfirmTitle>Stop all runs?</ModalConfirmTitle>
        </ModalHeader>
        <ModalConfirmBody>Three runs are in flight and will be cancelled.</ModalConfirmBody>
        <ModalFooter>
          <ModalConfirmCancel>Cancel</ModalConfirmCancel>
          <ModalConfirmAction>Stop runs</ModalConfirmAction>
        </ModalFooter>
      </ModalConfirmContent>
    </ModalConfirm>
  );
}
