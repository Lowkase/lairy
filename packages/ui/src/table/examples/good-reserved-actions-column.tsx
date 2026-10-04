"use client";

import { Table, type TableColumn } from "../table";

interface Job {
  id: string;
  name: string;
}

const JOBS: Job[] = [
  { id: "1", name: "Nightly ingest" },
  { id: "2", name: "Weekly rollup" },
];

const COLUMNS: TableColumn<Job>[] = [{ key: "name", header: "Name", render: (row) => row.name }];

/** The actions column is always there, whether or not the pointer is over a
 * row (anatomy #5) — hover and keyboard focus reveal it, and reaching an
 * action by Tab works the same as reaching it with a mouse (Accessibility
 * "Nothing hover-only"). */
export function TableGoodReservedActionsColumnExample() {
  return (
    <Table
      label="Jobs"
      columns={COLUMNS}
      rows={JOBS}
      getRowId={(row) => row.id}
      getRowLabel={(row) => row.name}
      selectable={false}
      rowActions={[
        { key: "run", label: "Run", icon: "run", onAction: (row) => console.log("run", row.id) },
        {
          key: "duplicate",
          label: "Duplicate",
          icon: "duplicate",
          onAction: (row) => console.log("duplicate", row.id),
        },
        {
          key: "delete",
          label: "Delete",
          icon: "trash",
          onAction: (row) => console.log("delete", row.id),
          overflowOnly: true,
          destructive: true,
        },
      ]}
    />
  );
}
