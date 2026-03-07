import { ColumnDefinition } from "./types";

export const usersTableCols: ColumnDefinition[] = [
  {
    name: "pages.users.columns.timestamp",
    id: "timestamp",
    type: "datetime",
    internal: 't."timestamp"',
  },
  {
    name: "pages.users.columns.userId",
    id: "userId",
    type: "stringOptions",
    options: [],
    internal: 'u."id"',
  },
];
