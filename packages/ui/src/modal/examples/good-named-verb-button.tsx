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

/** Do and don't, pair 1 (good): the object is named, the consequence
 * stated, and the button repeats the verb. */
export function ModalGoodNamedVerbButtonExample() {
  return (
    <ModalConfirm>
      <ModalConfirmTrigger asChild>
        <Button variant="danger">Delete</Button>
      </ModalConfirmTrigger>
      <ModalConfirmContent size="sm">
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
