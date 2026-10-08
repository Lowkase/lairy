import { render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SelectMulti } from "./select-multi";

const OPTIONS = [
  { value: "ingest", label: "Ingest", meta: "12 src" },
  { value: "normalize", label: "Normalize", meta: "4 rules" },
  { value: "summarize", label: "Summarize" },
  { value: "export", label: "Export" },
  { value: "archive", label: "Archive" },
];

const tokens = () => Array.from(document.querySelectorAll('[data-slot="select-multi-token"]')).map((t) => t.textContent);

function renderMulti(props: Partial<React.ComponentProps<typeof SelectMulti>> = {}) {
  return render(<SelectMulti label="Stages" placeholder="Select stages" options={OPTIONS} {...props} />);
}

describe("SelectMulti", () => {
  it("is a combobox named by its plural label, not the placeholder (Accessibility 'Multiselectable listbox')", () => {
    renderMulti();
    const field = screen.getByRole("combobox", { name: "Stages" });
    expect(field).toHaveAttribute("aria-expanded", "false");
    expect(field).toHaveTextContent("Select stages");
  });

  it("shows each chosen value as a token naming it in full, never a count", () => {
    renderMulti({ defaultValue: ["normalize", "export"] });
    expect(screen.getByRole("combobox")).not.toHaveTextContent("Select stages");
    expect(tokens()).toEqual(["Normalize✕", "Export✕"]);
    expect(screen.getByRole("button", { name: "Remove Normalize" })).toBeInTheDocument();
  });

  it("opens a multiselectable listbox with each row's checked state", async () => {
    const user = userEvent.setup();
    renderMulti({ defaultValue: ["normalize"] });
    await user.click(screen.getByRole("combobox"));

    const list = screen.getByRole("listbox");
    expect(list).toHaveAttribute("aria-multiselectable", "true");
    expect(screen.getByRole("combobox", { hidden: true })).toHaveAttribute("aria-expanded", "true");
    expect(within(list).getByRole("option", { name: /Normalize/ })).toHaveAttribute("aria-checked", "true");
    expect(within(list).getByRole("option", { name: /Ingest/ })).toHaveAttribute("aria-checked", "false");
    expect(within(list).getByText("12 src")).toBeInTheDocument();
  });

  it("picking does not close the menu (a set is built up)", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    renderMulti({ onValueChange });
    await user.click(screen.getByRole("combobox"));

    await user.click(screen.getByRole("option", { name: /Ingest/ }));
    await user.click(screen.getByRole("option", { name: /Export/ }));

    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(onValueChange).toHaveBeenLastCalledWith(["ingest", "export"]);
    expect(screen.getByRole("option", { name: /Ingest/ })).toHaveAttribute("aria-checked", "true");
  });

  it("clicking a checked row takes the value back out", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    renderMulti({ defaultValue: ["ingest", "export"], onValueChange });
    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("option", { name: /Ingest/ }));
    expect(onValueChange).toHaveBeenCalledWith(["export"]);
  });

  it("moves focus into the menu and Space toggles the active row while focus stays put", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    renderMulti({ onValueChange });
    await user.click(screen.getByRole("combobox"));

    const list = screen.getByRole("listbox");
    expect(list).toHaveFocus();

    await user.keyboard(" ");
    expect(onValueChange).toHaveBeenLastCalledWith(["ingest"]);
    await user.keyboard("{ArrowDown} ");
    expect(onValueChange).toHaveBeenLastCalledWith(["ingest", "normalize"]);

    expect(list).toBeInTheDocument();
    expect(list).toHaveFocus();
    expect(list.getAttribute("aria-activedescendant")).toBe(screen.getByRole("option", { name: /Normalize/ }).id);
  });

  it("Escape closes the menu, returns focus to the field and keeps the set intact", async () => {
    const user = userEvent.setup();
    renderMulti({ defaultValue: ["ingest"] });
    const field = screen.getByRole("combobox");
    await user.click(field);
    await user.keyboard("{ArrowDown} ");

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(field).toHaveFocus();
    expect(tokens()).toEqual(["Ingest✕", "Normalize✕"]);
  });

  it("holds focus inside the open menu: Tab cycles through the footer and wraps, never leaves", async () => {
    const user = userEvent.setup();
    renderMulti();
    await user.click(screen.getByRole("combobox"));
    const menu = screen.getByRole("listbox").parentElement as HTMLElement;

    const seen: (string | null)[] = [];
    for (let i = 0; i < 6; i++) {
      await user.tab();
      expect(menu).toContainElement(document.activeElement as HTMLElement);
      seen.push(document.activeElement?.textContent ?? null);
    }
    // The footer's buttons are reached, and the cycle wraps back round to them.
    expect(seen).toContain("All");
    expect(seen).toContain("Clear");
    expect(seen.filter((t) => t === "All").length).toBeGreaterThan(1);
  });

  it("each token's remove button takes its value out and returns focus to the field", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    renderMulti({ defaultValue: ["ingest", "export"], onValueChange });

    await user.click(screen.getByRole("button", { name: "Remove Ingest" }));
    expect(onValueChange).toHaveBeenCalledWith(["export"]);
    expect(screen.queryByRole("button", { name: "Remove Ingest" })).not.toBeInTheDocument();
    expect(screen.getByRole("combobox")).toHaveFocus();
  });

  it("Backspace with the field focused removes the last token", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    renderMulti({ defaultValue: ["ingest", "export"], onValueChange });
    await user.tab();
    expect(screen.getByRole("combobox")).toHaveFocus();

    await user.keyboard("{Backspace}");
    expect(onValueChange).toHaveBeenCalledWith(["ingest"]);
  });

  it("the footer counts against the total as a live region, and ALL / CLEAR move the whole set", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    renderMulti({ defaultValue: ["ingest"], onValueChange });
    await user.click(screen.getByRole("combobox"));

    expect(screen.getByRole("status")).toHaveTextContent("1 of 5 selected");

    await user.click(screen.getByRole("button", { name: "All" }));
    expect(onValueChange).toHaveBeenLastCalledWith(OPTIONS.map((o) => o.value));
    expect(screen.getByRole("status")).toHaveTextContent("5 of 5 selected");

    await user.click(screen.getByRole("button", { name: "Clear" }));
    expect(onValueChange).toHaveBeenLastCalledWith([]);
    expect(screen.getByRole("status")).toHaveTextContent("0 of 5 selected");
  });

  it("ties the error to the field with aria-describedby and sets aria-invalid", () => {
    renderMulti({ error: "Pick at least one stage" });
    const field = screen.getByRole("combobox");
    expect(field).toHaveAttribute("aria-invalid", "true");
    expect(field.getAttribute("aria-describedby")).toContain(screen.getByText("Pick at least one stage").id);
  });

  it("disabled: cannot open, tokens stay legible but lose their remove buttons", async () => {
    const user = userEvent.setup();
    renderMulti({ disabled: true, defaultValue: ["ingest"] });
    const field = screen.getByRole("combobox");
    expect(field).toBeDisabled();
    expect(tokens()).toEqual(["Ingest"]);
    expect(screen.queryByRole("button", { name: /Remove/ })).not.toBeInTheDocument();

    await user.click(field);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("skips a disabled option", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    renderMulti({
      onValueChange,
      options: [...OPTIONS.slice(0, 2), { value: "summarize", label: "Summarize", disabled: true }],
    });
    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("option", { name: /Summarize/ }));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("submits one hidden input per value under `name`", () => {
    const { container } = renderMulti({ name: "stages", defaultValue: ["ingest", "export"] });
    const inputs = container.querySelectorAll<HTMLInputElement>('input[type="hidden"][name="stages"]');
    expect(Array.from(inputs).map((i) => i.value)).toEqual(["ingest", "export"]);
  });

  describe("overflow", () => {
    const original = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetWidth");
    const originalClient = Object.getOwnPropertyDescriptor(Element.prototype, "clientWidth");
    afterEach(() => {
      if (original) Object.defineProperty(HTMLElement.prototype, "offsetWidth", original);
      if (originalClient) Object.defineProperty(Element.prototype, "clientWidth", originalClient);
    });

    function mockWidths(track: number) {
      Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
        configurable: true,
        get(this: HTMLElement) {
          return this.hasAttribute("data-measure-token") ? 100 : this.hasAttribute("data-measure-chip") ? 60 : 0;
        },
      });
      Object.defineProperty(Element.prototype, "clientWidth", { configurable: true, get: () => track });
    }

    it("collapses tokens that no longer fit into one exact counted chip, keeping one row", () => {
      mockWidths(300); // two tokens (100 + 8 + 100) plus the chip (8 + 60) fit; a third does not
      renderMulti({ defaultValue: ["ingest", "normalize", "summarize", "export"] });
      expect(screen.getAllByRole("button", { name: /^Remove / })).toHaveLength(2);
      expect(document.querySelector('[data-slot="select-multi-overflow"]')).toHaveTextContent("+2 more");
    });

    it("shows everything when it fits", () => {
      mockWidths(1000);
      renderMulti({ defaultValue: ["ingest", "normalize", "summarize", "export"] });
      expect(screen.getAllByRole("button", { name: /^Remove / })).toHaveLength(4);
      expect(document.querySelector('[data-slot="select-multi-overflow"]')).toBeNull();
    });

    it("falls back to a bare count when not even one token fits", () => {
      mockWidths(50);
      renderMulti({ defaultValue: ["ingest", "normalize"] });
      expect(document.querySelector('[data-slot="select-multi-overflow"]')).toHaveTextContent("2 selected");
    });
  });
});
