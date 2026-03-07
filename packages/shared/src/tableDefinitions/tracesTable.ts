import {
  type ColumnDefinition,
  type MultiValueOption,
  type ObservationLevelType,
  type SingleValueOption,
} from "..";
import { formatColumnOptions } from "./typeHelpers";

export const tracesOnlyCols: ColumnDefinition[] = [
  {
    name: "pages.traces.columns.bookmarked",
    id: "bookmarked",
    type: "boolean",
    internal: "t.bookmarked",
  },
  { name: "ID", id: "id", type: "string", internal: "t.id" },
  {
    name: "pages.traces.columns.name",
    id: "name",
    type: "stringOptions",
    internal: 't."name"',
    options: [], // to be filled in at runtime
    nullable: true,
  },
  {
    name: "pages.traces.columns.environment",
    id: "environment",
    type: "stringOptions",
    internal: 't."environment"',
    options: [], // to be filled in at runtime
  },
  {
    name: "pages.traces.columns.timestamp",
    id: "timestamp",
    type: "datetime",
    internal: 't."timestamp"',
  },
  {
    name: "pages.traces.columns.userId",
    id: "userId",
    type: "string",
    internal: 't."user_id"',
    nullable: true,
  },
  {
    name: "pages.traces.columns.sessionId",
    id: "sessionId",
    type: "string",
    internal: 't."session_id"',
    nullable: true,
  },
  {
    name: "pages.traces.columns.metadata",
    id: "metadata",
    type: "stringObject",
    internal: 't."metadata"',
  },
  {
    name: "pages.traces.columns.version",
    id: "version",
    type: "string",
    internal: 't."version"',
    nullable: true,
  },
  {
    name: "pages.traces.columns.release",
    id: "release",
    type: "string",
    internal: 't."release"',
    nullable: true,
  },
  {
    name: "pages.traces.columns.level",
    id: "level",
    type: "stringOptions",
    internal: '"level"',
    options: [
      { value: "DEBUG" },
      { value: "DEFAULT" },
      { value: "WARNING" },
      { value: "ERROR" },
    ] as { value: ObservationLevelType }[],
  },
  {
    name: "pages.traces.columns.tags",
    id: "tags",
    type: "arrayOptions",
    internal: 't."tags"',
    options: [], // to be filled in at runtime
  },
];

export const tracesTableCols: ColumnDefinition[] = [
  ...tracesOnlyCols,
  {
    name: "pages.traces.columns.inputTokens",
    id: "inputTokens",
    type: "number",
    internal: 'generation_metrics."promptTokens"',
    nullable: true,
  },
  {
    name: "pages.traces.columns.outputTokens",
    id: "outputTokens",
    type: "number",
    internal: 'generation_metrics."completionTokens"',
    nullable: true,
  },
  {
    name: "pages.traces.columns.errorCount",
    id: "errorCount",
    type: "number",
    internal: 'generation_metrics."errorCount"',
  },
  {
    name: "pages.traces.columns.warningCount",
    id: "warningCount",
    type: "number",
    internal: 'generation_metrics."warningCount"',
  },
  {
    name: "pages.traces.columns.defaultCount",
    id: "defaultCount",
    type: "number",
    internal: 'generation_metrics."defaultCount"',
  },
  {
    name: "pages.traces.columns.debugCount",
    id: "debugCount",
    type: "number",
    internal: 'generation_metrics."debugCount"',
  },
  {
    name: "pages.traces.columns.totalTokens",
    id: "totalTokens",
    type: "number",
    internal: 'generation_metrics."totalTokens"',
    nullable: true,
  },
  {
    name: "pages.traces.columns.tokens",
    id: "tokens",
    type: "number",
    internal: 'generation_metrics."totalTokens"',
    nullable: true,
  },
  {
    name: "pages.traces.columns.scoresNumeric",
    id: "scores_avg",
    type: "numberObject",
    internal: "scores_avg",
  },
  {
    name: "pages.traces.columns.scoresCategorical",
    id: "score_categories",
    type: "categoryOptions",
    internal: "score_categories",
    options: [], // to be filled in at runtime
    nullable: true,
  },
  {
    name: "pages.traces.columns.latencySeconds",
    id: "latency",
    type: "number",
    internal: "observation_metrics.latency",
  },
  {
    name: "pages.traces.columns.inputCostUSD",
    id: "inputCost",
    type: "number",
    internal: '"calculatedInputCost"',
    nullable: true,
  },
  {
    name: "pages.traces.columns.outputCostUSD",
    id: "outputCost",
    type: "number",
    internal: '"calculatedOutputCost"',
    nullable: true,
  },
  {
    name: "pages.traces.columns.totalCostUSD",
    id: "totalCost",
    type: "number",
    internal: '"calculatedTotalCost"',
    nullable: true,
  },
  {
    name: "pages.traces.columns.commentCount",
    id: "commentCount",
    type: "number",
    internal: "", // handled by comment filter helpers
  },
  {
    name: "pages.traces.columns.commentContent",
    id: "commentContent",
    type: "string",
    internal: "", // handled by comment filter helpers
  },
];

export const datasetCol: ColumnDefinition = {
  name: "pages.traces.columns.dataset",
  id: "datasetId",
  type: "stringOptions",
  internal: 'di."dataset_id"',
  options: [], // to be filled in at runtime
};

// Used only for dataset evaluator, not on dataset table
export const datasetOnlyCols: ColumnDefinition[] = [datasetCol];

export const evalTraceTableCols: ColumnDefinition[] = tracesOnlyCols;
export const evalDatasetFormFilterCols: ColumnDefinition[] = datasetOnlyCols;

export type TraceOptions = {
  scores_avg?: Array<string>;
  score_categories?: Array<MultiValueOption>;
  name?: Array<SingleValueOption>;
  tags?: Array<SingleValueOption>;
  environment?: Array<SingleValueOption>;
};
export type DatasetOptions = {
  datasetId: Array<SingleValueOption>;
};

// Used only for dataset evaluator, not on dataset table
export function datasetFormFilterColsWithOptions(
  options?: DatasetOptions,
  cols: ColumnDefinition[] = evalDatasetFormFilterCols,
): ColumnDefinition[] {
  return cols.map((col) => {
    if (col.id === "datasetId") {
      return formatColumnOptions(col, options?.datasetId ?? []);
    }
    return col;
  });
}

export function tracesTableColsWithOptions(
  options?: TraceOptions,
  cols: ColumnDefinition[] = tracesTableCols,
): ColumnDefinition[] {
  return cols.map((col) => {
    if (col.id === "scores_avg") {
      return formatColumnOptions(col, options?.scores_avg ?? []);
    }
    if (col.id === "name") {
      return formatColumnOptions(col, options?.name ?? []);
    }
    if (col.id === "tags") {
      return formatColumnOptions(col, options?.tags ?? []);
    }
    if (col.id === "environment") {
      return formatColumnOptions(col, options?.environment ?? []);
    }
    if (col.id === "score_categories") {
      return formatColumnOptions(col, options?.score_categories ?? []);
    }
    return col;
  });
}
