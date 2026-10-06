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

/** Do and don't, pair 2 (bad): never four actions in a footer — a modal
 * with a menu in it is a decision nobody can make. */
export function ModalBadFourActionsExample() {
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
        <ModalFooter className="flex-wrap">
          <ModalConfirmCancel>Cancel</ModalConfirmCancel>
          <ModalConfirmAction>Stop now</ModalConfirmAction>
          <ModalConfirmAction>Stop after</ModalConfirmAction>
          <ModalConfirmCancel>Schedule…</ModalConfirmCancel>
        </ModalFooter>
      </ModalConfirmContent>
    </ModalConfirm>
  );
}
