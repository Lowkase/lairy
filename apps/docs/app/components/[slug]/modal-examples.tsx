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
import type { ComponentType } from "react";

export const MODAL_EXAMPLES: Record<string, ComponentType> = {
  demo: ModalDemoExample,
  sm: ModalSmExample,
  md: ModalMdExample,
  lg: ModalLgExample,
  "good-named-verb-button": ModalGoodNamedVerbButtonExample,
  "bad-are-you-sure": ModalBadAreYouSureExample,
  "good-two-actions": ModalGoodTwoActionsExample,
  "bad-four-actions": ModalBadFourActionsExample,
  "good-one-field": ModalGoodOneFieldExample,
  "bad-scrolling-form": ModalBadScrollingFormExample,
};
