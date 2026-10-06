import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  Modal,
  ModalAction,
  ModalBody,
  ModalCancel,
  ModalClose,
  ModalConfirm,
  ModalConfirmAction,
  ModalConfirmBody,
  ModalConfirmCancel,
  ModalConfirmContent,
  ModalConfirmTitle,
  ModalConfirmTrigger,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from "./modal";

function renderBenign() {
  render(
    <div>
      <button type="button">Elsewhere</button>
      <Modal>
        <ModalTrigger>Rename</ModalTrigger>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Rename workflow</ModalTitle>
            <ModalClose />
          </ModalHeader>
          <ModalBody>Its schedule keeps running under the new name.</ModalBody>
          <ModalFooter>
            <ModalCancel>Cancel</ModalCancel>
            <ModalAction>Rename</ModalAction>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>,
  );
}

function renderConfirm() {
  render(
    <ModalConfirm>
      <ModalConfirmTrigger>Delete</ModalConfirmTrigger>
      <ModalConfirmContent>
        <ModalHeader>
          <ModalConfirmTitle>Delete &ldquo;rebalance&rdquo;?</ModalConfirmTitle>
        </ModalHeader>
        <ModalConfirmBody>This cannot be undone.</ModalConfirmBody>
        <ModalFooter>
          <ModalConfirmCancel>Cancel</ModalConfirmCancel>
          <ModalConfirmAction>Delete workflow</ModalConfirmAction>
        </ModalFooter>
      </ModalConfirmContent>
    </ModalConfirm>,
  );
}

describe("Modal (benign)", () => {
  it("is hidden until the trigger is clicked", () => {
    renderBenign();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens as role=dialog with aria-modal, labelled by the header and described by the body (Accessibility 'Dialog and modal')", async () => {
    const user = userEvent.setup();
    renderBenign();
    await user.click(screen.getByRole("button", { name: "Rename" }));

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAccessibleName("Rename workflow");
    expect(dialog).toHaveAccessibleDescription("Its schedule keeps running under the new name.");
  });

  it("is trapped — the rest of the page is aria-hidden while open (Accessibility 'Focus is trapped')", async () => {
    const user = userEvent.setup();
    renderBenign();
    expect(screen.getByRole("button", { name: "Elsewhere" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Rename" }));

    // The default (non-hidden) query excludes anything aria-hidden, so its
    // disappearance here *is* the aria-hidden assertion — Radix sets the
    // attribute on a shared ancestor, not on "Elsewhere" itself.
    await waitFor(() =>
      expect(screen.queryByRole("button", { name: "Elsewhere" })).not.toBeInTheDocument(),
    );
  });

  it("focuses the primary action on open, not Cancel (Accessibility 'No default on destruct')", async () => {
    const user = userEvent.setup();
    renderBenign();
    await user.click(screen.getByRole("button", { name: "Rename" }));

    await waitFor(() => expect(screen.getByRole("button", { name: "Rename", hidden: false })).not.toBe(null));
    const actions = screen.getAllByRole("button", { name: "Rename" });
    const primary = actions[actions.length - 1];
    await waitFor(() => expect(primary).toHaveFocus());
  });

  it("the close glyph closes it and returns focus to the trigger", async () => {
    const user = userEvent.setup();
    renderBenign();
    const trigger = screen.getByRole("button", { name: "Rename" });
    await user.click(trigger);
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Close" }));

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it("Escape closes it and returns focus to the trigger (Accessibility 'Escape, always')", async () => {
    const user = userEvent.setup();
    renderBenign();
    const trigger = screen.getByRole("button", { name: "Rename" });
    await user.click(trigger);

    await user.keyboard("{Escape}");

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it("Cancel and the primary action both close it (Content rule 'Two actions maximum')", async () => {
    const user = userEvent.setup();
    renderBenign();
    await user.click(screen.getByRole("button", { name: "Rename" }));
    await user.click(screen.getByRole("button", { name: "Cancel" }));

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });
});

describe("ModalConfirm (destructive)", () => {
  it('renders role="alertdialog"', async () => {
    const user = userEvent.setup();
    renderConfirm();
    await user.click(screen.getByRole("button", { name: "Delete" }));

    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
  });

  it("has no close glyph (anatomy #3: 'always present except on a destructive confirm')", async () => {
    const user = userEvent.setup();
    renderConfirm();
    await user.click(screen.getByRole("button", { name: "Delete" }));

    expect(screen.queryByRole("button", { name: "Close" })).not.toBeInTheDocument();
  });

  it("focuses Cancel on open, not the primary action (Accessibility 'No default on destruct')", async () => {
    const user = userEvent.setup();
    renderConfirm();
    await user.click(screen.getByRole("button", { name: "Delete" }));

    await waitFor(() => expect(screen.getByRole("button", { name: "Cancel" })).toHaveFocus());
  });

  it("Escape still closes it (Accessibility 'Escape, always')", async () => {
    const user = userEvent.setup();
    renderConfirm();
    const trigger = screen.getByRole("button", { name: "Delete" });
    await user.click(trigger);

    await user.keyboard("{Escape}");

    await waitFor(() => expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it("an outside click does not close it (Accessibility 'the scrim click is only wired up when nothing can be lost')", async () => {
    const user = userEvent.setup();
    renderConfirm();
    await user.click(screen.getByRole("button", { name: "Delete" }));
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();

    const overlay = document.querySelector('[data-slot="modal-confirm-overlay"]');
    expect(overlay).not.toBeNull();
    await user.click(overlay as Element);

    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
  });

  it("the primary action never ships the danger Button variant (Accessibility 'Never colour alone')", async () => {
    const user = userEvent.setup();
    renderConfirm();
    await user.click(screen.getByRole("button", { name: "Delete" }));

    const action = screen.getByRole("button", { name: "Delete workflow" });
    expect(action.className).toContain("bg-accent");
  });

  it("Cancel closes it and returns focus to the trigger", async () => {
    const user = userEvent.setup();
    renderConfirm();
    const trigger = screen.getByRole("button", { name: "Delete" });
    await user.click(trigger);
    await user.click(screen.getByRole("button", { name: "Cancel" }));

    await waitFor(() => expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it("the primary action closes it (Rules 'Two actions maximum')", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <ModalConfirm>
        <ModalConfirmTrigger>Delete</ModalConfirmTrigger>
        <ModalConfirmContent>
          <ModalHeader>
            <ModalConfirmTitle>Delete?</ModalConfirmTitle>
          </ModalHeader>
          <ModalConfirmBody>Gone for good.</ModalConfirmBody>
          <ModalFooter>
            <ModalConfirmCancel>Cancel</ModalConfirmCancel>
            <ModalConfirmAction onClick={onSelect}>Delete workflow</ModalConfirmAction>
          </ModalFooter>
        </ModalConfirmContent>
      </ModalConfirm>,
    );
    await user.click(screen.getByRole("button", { name: "Delete" }));
    await user.click(screen.getByRole("button", { name: "Delete workflow" }));

    expect(onSelect).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument());
  });
});
