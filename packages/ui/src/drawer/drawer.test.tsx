import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import {
  Drawer,
  DrawerAction,
  DrawerBody,
  DrawerCancel,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerMeta,
  DrawerTitle,
  DrawerTrigger,
} from "./drawer";

function renderDrawer() {
  render(
    <div>
      <button type="button">Elsewhere</button>
      <Drawer>
        <DrawerTrigger>Open</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <div>
              <DrawerTitle>Details</DrawerTitle>
              <DrawerMeta>AUT · 02</DrawerMeta>
            </div>
            <DrawerClose />
          </DrawerHeader>
          <DrawerBody>Owner: aria</DrawerBody>
          <DrawerFooter>
            <DrawerCancel>Cancel</DrawerCancel>
            <DrawerAction>Save</DrawerAction>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>,
  );
}

describe("Drawer", () => {
  it("is hidden until the trigger is clicked", () => {
    renderDrawer();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens as role=dialog with aria-modal, labelled by the header and described by the body (Accessibility 'Dialog, and modal about it')", async () => {
    const user = userEvent.setup();
    renderDrawer();
    await user.click(screen.getByRole("button", { name: "Open" }));

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAccessibleName("Details");
    expect(dialog).toHaveAccessibleDescription("Owner: aria");
  });

  it("is trapped — the rest of the page is aria-hidden while open (Accessibility 'Focus in, focus back')", async () => {
    const user = userEvent.setup();
    renderDrawer();
    expect(screen.getByRole("button", { name: "Elsewhere" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Open" }));

    await waitFor(() =>
      expect(screen.queryByRole("button", { name: "Elsewhere" })).not.toBeInTheDocument(),
    );
  });

  it("the close glyph closes it and returns focus to the trigger (Accessibility 'Two ways out')", async () => {
    const user = userEvent.setup();
    renderDrawer();
    const trigger = screen.getByRole("button", { name: "Open" });
    await user.click(trigger);
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Close" }));

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it("Escape closes it and returns focus to the trigger (Accessibility 'Two ways out')", async () => {
    const user = userEvent.setup();
    renderDrawer();
    const trigger = screen.getByRole("button", { name: "Open" });
    await user.click(trigger);

    await user.keyboard("{Escape}");

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it("an outside (scrim) click closes it (anatomy #1: 'a click on it closes the drawer')", async () => {
    const user = userEvent.setup();
    renderDrawer();
    await user.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    const overlay = document.querySelector('[data-slot="drawer-overlay"]');
    expect(overlay).not.toBeNull();
    await user.click(overlay as Element);

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("Cancel and the primary action both close it", async () => {
    const user = userEvent.setup();
    renderDrawer();
    await user.click(screen.getByRole("button", { name: "Open" }));
    await user.click(screen.getByRole("button", { name: "Cancel" }));

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("reads header, body then footer in the DOM (Accessibility 'Reading order')", async () => {
    const user = userEvent.setup();
    renderDrawer();
    await user.click(screen.getByRole("button", { name: "Open" }));

    const dialog = screen.getByRole("dialog");
    const slots = Array.from(dialog.querySelectorAll('[data-slot]'))
      .map((el) => el.getAttribute("data-slot"))
      .filter((slot) => slot === "drawer-header" || slot === "drawer-body" || slot === "drawer-footer");
    expect(slots).toEqual(["drawer-header", "drawer-body", "drawer-footer"]);
  });
});
