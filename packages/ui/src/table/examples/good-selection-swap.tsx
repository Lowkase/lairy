"use client";

import { Table, type TableColumn } from "../table";

interface Job {
  id: string;
  name: string;
}

const JOBS: Job[] = [
  { id: "1", name: "Nightly ingest" },
  { id: "2", name: "Weekly rollup" },
  { id: "3", name: "Hourly sync" },
];

const COLUMNS: TableColumn<Job>[] = [{ key: "name", header: "Name", render: (row) => row.name }];

/** Ships with two rows already checked so the selection toolbar — the one
 * that replaces the idle bar in place rather than stacking beside it
 * (Zones "Toolbar — selection") — renders without needing a click first. */
export function TableGoodSelectionSwapExample() {
  return (
    <Table
      label="Jobs"
      columns={COLUMNS}
      rows={JOBS}
      getRowId={(row) => row.id}
      getRowLabel={(row) => row.name}
      defaultSelected={["1", "2"]}
      countLabel="3 jobs"
      bulkActions={[
        { key: "run", label: "Run", icon: "run", onAction: (ids) => console.log("run", ids) },
      ]}
    />
  );
}
