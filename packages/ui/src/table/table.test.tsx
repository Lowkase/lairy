import { render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Table, type TableColumn } from "./table";

interface Automation {
  id: string;
  name: string;
  status: string;
}

const ROWS: Automation[] = [
  { id: "a", name: "summarize", status: "Running" },
  { id: "b", name: "ingest", status: "Idle" },
  { id: "c", name: "rebalance", status: "Queued" },
];

const COLUMNS: TableColumn<Automation>[] = [
  { key: "name", header: "Name", render: (row) => row.name },
  { key: "status", header: "Status", render: (row) => row.status },
];

describe("Table", () => {
  it("renders a real grid with a columnheader per column and a row per record", () => {
    render(
      <Table
        label="Automations"
        columns={COLUMNS}
        rows={ROWS}
        getRowId={(r) => r.id}
        getRowLabel={(r) => r.name}
      />,
    );
    expect(screen.getByRole("grid", { name: "Automations" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Name" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Status" })).toBeInTheDocument();
    // Header row + 3 body rows.
    expect(screen.getAllByRole("row")).toHaveLength(4);
  });

  it("ships with the idle toolbar when nothing is selected (Zones 'Toolbar — idle')", () => {
    render(
      <Table
        label="Automations"
        columns={COLUMNS}
        rows={ROWS}
        getRowId={(r) => r.id}
        getRowLabel={(r) => r.name}
        countLabel="3 automations"
      />,
    );
    expect(screen.getByText("3 automations")).toBeInTheDocument();
    expect(screen.queryByText("selected")).not.toBeInTheDocument();
  });

  it("checking a row swaps the toolbar to the selection state (Zones 'Toolbar — selection')", async () => {
    const user = userEvent.setup();
    render(
      <Table
        label="Automations"
        columns={COLUMNS}
        rows={ROWS}
        getRowId={(r) => r.id}
        getRowLabel={(r) => r.name}
      />,
    );
    await user.click(screen.getByRole("checkbox", { name: "Select summarize" }));
    expect(screen.getByText("1 selected")).toBeInTheDocument();
  });

  it("the row carries aria-selected once checked (Accessibility 'Selection is announced')", async () => {
    const user = userEvent.setup();
    render(
      <Table
        label="Automations"
        columns={COLUMNS}
        rows={ROWS}
        getRowId={(r) => r.id}
        getRowLabel={(r) => r.name}
      />,
    );
    const row = screen.getByRole("row", { name: /summarize/ });
    expect(row).toHaveAttribute("aria-selected", "false");
    await user.click(screen.getByRole("checkbox", { name: "Select summarize" }));
    expect(row).toHaveAttribute("aria-selected", "true");
  });

  it("the header checkbox selects every row and goes indeterminate for a partial selection", async () => {
    const user = userEvent.setup();
    render(
      <Table
        label="Automations"
        columns={COLUMNS}
        rows={ROWS}
        getRowId={(r) => r.id}
        getRowLabel={(r) => r.name}
      />,
    );
    const selectAll = screen.getByRole("checkbox", { name: "Select all rows" }) as HTMLInputElement;

    await user.click(screen.getByRole("checkbox", { name: "Select ingest" }));
    expect(selectAll.indeterminate).toBe(true);

    await user.click(selectAll);
    expect(screen.getByText("3 selected")).toBeInTheDocument();

    await user.click(selectAll);
    expect(screen.queryByText(/selected/)).not.toBeInTheDocument();
  });

  it("Clear empties the selection and returns to the idle toolbar", async () => {
    const user = userEvent.setup();
    render(
      <Table
        label="Automations"
        columns={COLUMNS}
        rows={ROWS}
        getRowId={(r) => r.id}
        getRowLabel={(r) => r.name}
        countLabel="3 total"
      />,
    );
    await user.click(screen.getByRole("checkbox", { name: "Select ingest" }));
    await user.click(screen.getByRole("button", { name: "Clear" }));
    expect(screen.getByText("3 total")).toBeInTheDocument();
  });

  it("a bulk action receives every selected row's id", async () => {
    const user = userEvent.setup();
    const onRun = vi.fn();
    render(
      <Table
        label="Automations"
        columns={COLUMNS}
        rows={ROWS}
        getRowId={(r) => r.id}
        getRowLabel={(r) => r.name}
        bulkActions={[{ key: "run", label: "Run", icon: "run", onAction: onRun }]}
      />,
    );
    await user.click(screen.getByRole("checkbox", { name: "Select summarize" }));
    await user.click(screen.getByRole("checkbox", { name: "Select ingest" }));
    await user.click(screen.getByRole("button", { name: "Run" }));
    expect(onRun).toHaveBeenCalledWith(["a", "b"]);
  });

  it("an inline row action receives that row (anatomy #5 'the two or three frequent verbs as icons')", async () => {
    const user = userEvent.setup();
    const onRun = vi.fn();
    render(
      <Table
        label="Automations"
        columns={COLUMNS}
        rows={ROWS}
        getRowId={(r) => r.id}
        getRowLabel={(r) => r.name}
        rowActions={[{ key: "run", label: "Run", icon: "run", onAction: onRun }]}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Run summarize" }));
    expect(onRun).toHaveBeenCalledWith(ROWS[0]);
  });

  it("overflow actions sit behind the row's own ⋯ menu (anatomy #5 'an overflow … for the rest')", async () => {
    const user = userEvent.setup();
    const onArchive = vi.fn();
    render(
      <Table
        label="Automations"
        columns={COLUMNS}
        rows={ROWS}
        getRowId={(r) => r.id}
        getRowLabel={(r) => r.name}
        rowActions={[
          {
            key: "archive",
            label: "Archive",
            icon: "archive",
            onAction: onArchive,
            overflowOnly: true,
          },
        ]}
      />,
    );
    expect(screen.queryByRole("menuitem")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "More actions for summarize" }));
    const item = screen.getByRole("menuitem", { name: "Archive" });
    expect(item).toBeInTheDocument();
    await user.click(item);
    expect(onArchive).toHaveBeenCalledWith(ROWS[0]);
    expect(screen.queryByRole("menuitem")).not.toBeInTheDocument();
  });

  it("a destructive overflow action sits under its own labelled divider (anatomy #5; Related 'Popover')", async () => {
    const user = userEvent.setup();
    render(
      <Table
        label="Automations"
        columns={COLUMNS}
        rows={ROWS}
        getRowId={(r) => r.id}
        getRowLabel={(r) => r.name}
        rowActions={[
          {
            key: "history",
            label: "View history",
            icon: "export",
            onAction: vi.fn(),
            overflowOnly: true,
          },
          {
            key: "delete",
            label: "Delete permanently",
            icon: "trash",
            onAction: vi.fn(),
            overflowOnly: true,
            destructive: true,
          },
        ]}
      />,
    );
    await user.click(screen.getByRole("button", { name: "More actions for summarize" }));
    const menu = screen.getByRole("menu");
    expect(within(menu).getByText("Destructive")).toBeInTheDocument();
    expect(within(menu).getByRole("menuitem", { name: "Delete permanently" })).toBeInTheDocument();
  });

  it("Escape closes the overflow menu and returns focus to its own trigger (AGENTS.md rule 7)", async () => {
    const user = userEvent.setup();
    render(
      <Table
        label="Automations"
        columns={COLUMNS}
        rows={ROWS}
        getRowId={(r) => r.id}
        getRowLabel={(r) => r.name}
        rowActions={[
          {
            key: "archive",
            label: "Archive",
            icon: "archive",
            onAction: vi.fn(),
            overflowOnly: true,
          },
        ]}
      />,
    );
    const trigger = screen.getByRole("button", { name: "More actions for summarize" });
    await user.click(trigger);
    expect(screen.getByRole("menuitem", { name: "Archive" })).toHaveFocus();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("stays controlled by the selected prop rather than its own state", async () => {
    const user = userEvent.setup();
    let seen: string[] = [];
    render(
      <Table
        label="Automations"
        columns={COLUMNS}
        rows={ROWS}
        getRowId={(r) => r.id}
        getRowLabel={(r) => r.name}
        selected={seen}
        onSelectedChange={(next) => {
          seen = next;
        }}
      />,
    );
    await user.click(screen.getByRole("checkbox", { name: "Select summarize" }));
    expect(seen).toEqual(["a"]);
    expect(screen.getByRole("checkbox", { name: "Select summarize" })).not.toBeChecked();
  });

  it("drops the select column and toolbar when selectable is false", () => {
    render(
      <Table
        label="Automations"
        columns={COLUMNS}
        rows={ROWS}
        getRowId={(r) => r.id}
        getRowLabel={(r) => r.name}
        selectable={false}
      />,
    );
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  });
});
