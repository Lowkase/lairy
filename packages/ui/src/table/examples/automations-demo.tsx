"use client";

import { useState } from "react";
import { Button } from "../../button/button";
import { cn } from "../../cn";
import { TableRowIcon } from "../table-icons";
import { Table, type TableColumn } from "../table";

interface Automation {
  id: string;
  name: string;
  status: "Running" | "Idle" | "Queued" | "Failed";
  owner: string;
  last: string;
}

// archive/v1/Workspace Shell.dc.html's own tableData() (~14821).
const AUTOMATIONS: Automation[] = [
  { id: "AUT·02", name: "summarize", status: "Running", owner: "you", last: "7s ago" },
  { id: "AUT·05", name: "ingest", status: "Idle", owner: "you", last: "2m ago" },
  { id: "FLT·03", name: "rebalance", status: "Queued", owner: "system", last: "12m ago" },
  { id: "RES·11", name: "index-papers", status: "Running", owner: "you", last: "31s ago" },
  { id: "SIG·07", name: "watch-feeds", status: "Failed", owner: "system", last: "1h ago" },
  { id: "KNW·04", name: "embed-notes", status: "Idle", owner: "you", last: "4h ago" },
];

// Neither Running nor Failed ships as plain coloured text: axe measured
// bare --accent at this row's own 12px Label size on the light theme's
// --panel at 4.42:1, and --alarm fares far worse (~1.9:1, the same gap
// button.ts's Danger label and tabs.ts's selected label already route
// around) — both short of AA's 4.5:1 floor. A small dot carries the colour
// instead, paired with an ordinary --fg word, reusing this same file's own
// selection-chip dot rather than a second convention.
function StatusCell({ status }: { status: Automation["status"] }) {
  if (status === "Running" || status === "Failed") {
    return (
      <span className="flex items-center gap-6 text-fg">
        <span
          className={cn("size-6 rounded-full", status === "Running" ? "bg-accent" : "bg-alarm")}
          aria-hidden="true"
        />
        {status}
      </span>
    );
  }
  return <span className="text-mute">{status}</span>;
}

const COLUMNS: TableColumn<Automation>[] = [
  {
    key: "id",
    header: "ID",
    width: "96px",
    render: (row) => <span className="text-mute">{row.id}</span>,
  },
  {
    key: "name",
    header: "Name",
    render: (row) => <span className="block truncate text-body text-fg">{row.name}</span>,
  },
  {
    key: "status",
    header: "Status",
    width: "96px",
    render: (row) => <StatusCell status={row.status} />,
  },
  {
    key: "owner",
    header: "Owner",
    width: "96px",
    render: (row) => <span className="text-mute">{row.owner}</span>,
  },
  {
    key: "last",
    header: "Last run",
    align: "right",
    width: "96px",
    render: (row) => <span className="text-mute">{row.last}</span>,
  },
];

export function TableAutomationsDemoExample() {
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <Table
      label="Automations"
      columns={COLUMNS}
      rows={AUTOMATIONS}
      getRowId={(row) => row.id}
      getRowLabel={(row) => row.name}
      selected={selected}
      onSelectedChange={setSelected}
      countLabel={`${AUTOMATIONS.length} automations`}
      toolbarActions={
        <>
          <Button variant="secondary" icon={<TableRowIcon name="export" />}>
            Export
          </Button>
          <Button variant="primary" icon={<TableRowIcon name="create" />}>
            Create
          </Button>
        </>
      }
      rowActions={[
        { key: "run", label: "Run", icon: "run", onAction: (row) => console.log("run", row.id) },
        {
          key: "duplicate",
          label: "Duplicate",
          icon: "duplicate",
          onAction: (row) => console.log("duplicate", row.id),
        },
        {
          key: "history",
          label: "View history",
          icon: "export",
          onAction: (row) => console.log("history", row.id),
          overflowOnly: true,
        },
        {
          key: "archive",
          label: "Archive",
          icon: "archive",
          onAction: (row) => console.log("archive", row.id),
          overflowOnly: true,
          destructive: true,
        },
        {
          key: "delete",
          label: "Delete permanently",
          icon: "trash",
          onAction: (row) => console.log("delete", row.id),
          overflowOnly: true,
          destructive: true,
        },
      ]}
      bulkActions={[
        { key: "run", label: "Run", icon: "run", onAction: (ids) => console.log("run", ids) },
        {
          key: "duplicate",
          label: "Duplicate",
          icon: "duplicate",
          onAction: (ids) => console.log("duplicate", ids),
        },
        {
          key: "delete",
          label: "Delete",
          icon: "trash",
          onAction: (ids) => console.log("delete", ids),
          destructive: true,
        },
      ]}
    />
  );
}
