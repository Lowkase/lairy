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

export function ModalDemoExample() {
  return (
    <ModalConfirm>
      <ModalConfirmTrigger asChild>
        <Button variant="danger">Delete workflow</Button>
      </ModalConfirmTrigger>
      <ModalConfirmContent>
        <ModalHeader>
          <ModalConfirmTitle>Delete &ldquo;rebalance&rdquo;?</ModalConfirmTitle>
        </ModalHeader>
        <ModalConfirmBody>
          Its 214 past runs stay; the schedule stops tonight. This cannot be undone.
        </ModalConfirmBody>
        <ModalFooter>
          <ModalConfirmCancel>Cancel</ModalConfirmCancel>
          <ModalConfirmAction>Delete workflow</ModalConfirmAction>
        </ModalFooter>
      </ModalConfirmContent>
    </ModalConfirm>
  );
}
