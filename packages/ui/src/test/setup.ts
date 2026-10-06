import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";

// jsdom implements neither of these, and Radix's own focus/pointer-capture
// handling (Popover, DropdownMenu — packages/ui/src/popover) calls both
// unconditionally when a panel opens or a row is navigated to.
if (!Element.prototype.hasPointerCapture) {
  Element.prototype.hasPointerCapture = () => false;
}
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}

afterEach(() => {
  cleanup();
});
