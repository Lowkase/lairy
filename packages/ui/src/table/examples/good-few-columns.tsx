"use client";

import { Table, type TableColumn } from "../table";

interface Deploy {
  id: string;
  name: string;
  status: string;
  deployedAt: string;
}

const DEPLOYS: Deploy[] = [
  { id: "1", name: "Nightly ingest", status: "Running", deployedAt: "2m ago" },
  { id: "2", name: "Weekly rollup", status: "Idle", deployedAt: "6d ago" },
];

const COLUMNS: TableColumn<Deploy>[] = [
  { key: "name", header: "Name", render: (row) => row.name },
  { key: "status", header: "Status", render: (row) => row.status },
  { key: "deployedAt", header: "Last run", align: "right", render: (row) => row.deployedAt },
];

export function TableGoodFewColumnsExample() {
  return (
    <Table
      label="Deploys"
      columns={COLUMNS}
      rows={DEPLOYS}
      getRowId={(row) => row.id}
      getRowLabel={(row) => row.name}
      selectable={false}
    />
  );
}
