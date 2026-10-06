import {
  ModalBadAreYouSureExample,
  ModalBadFourActionsExample,
  ModalBadScrollingFormExample,
  ModalDemoExample,
  ModalGoodNamedVerbButtonExample,
  ModalGoodOneFieldExample,
  ModalGoodTwoActionsExample,
  ModalLgExample,
  ModalMdExample,
  ModalSmExample,
} from "@lairy/ui/modal/examples";
import { ThemeToggle } from "../../../components/theme-toggle";

export default function ModalDevPage() {
  return (
    <ThemeToggle>
      <div className="flex flex-wrap items-start gap-32 p-32">
        <ModalDemoExample />
        <ModalSmExample />
        <ModalMdExample />
        <ModalLgExample />
        <ModalGoodNamedVerbButtonExample />
        <ModalBadAreYouSureExample />
        <ModalGoodTwoActionsExample />
        <ModalBadFourActionsExample />
        <ModalGoodOneFieldExample />
        <ModalBadScrollingFormExample />
      </div>
    </ThemeToggle>
  );
}
