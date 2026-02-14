import { tracesTableCols } from "@langfuse/shared";
import type { FilterConfig } from "@/src/features/filters/lib/filter-config";

export const traceFilterConfig: FilterConfig = {
  tableName: "traces",

  columnDefinitions: tracesTableCols,

  defaultExpanded: ["environment", "name"],

  facets: [
    {
      type: "categorical" as const,
      column: "environment",
      label: "pages.traces.columns.environment",
    },
    {
      type: "categorical" as const,
      column: "name",
      label: "pages.traces.columns.traceName",
    },
    {
      type: "string" as const,
      column: "id",
      label: "pages.traces.columns.traceId",
    },
    {
      type: "categorical" as const,
      column: "userId",
      label: "pages.users.columns.userId",
    },
    {
      type: "categorical" as const,
      column: "sessionId",
      label: "pages.traces.columns.sessionId",
    },
    {
      type: "stringKeyValue" as const,
      column: "metadata",
      label: "pages.traces.columns.metadata",
    },
    {
      type: "string" as const,
      column: "version",
      label: "pages.traces.columns.version",
    },
    {
      type: "string" as const,
      column: "release",
      label: "pages.traces.columns.release",
    },
    {
      type: "boolean" as const,
      column: "bookmarked",
      label: "pages.traces.columns.bookmarked",
      trueLabel: "common.filters.bookmarked",
      falseLabel: "common.filters.notBookmarked",
    },
    {
      type: "numeric" as const,
      column: "commentCount",
      label: "pages.traces.columns.commentCount",
      min: 0,
      max: 100,
    },
    {
      type: "string" as const,
      column: "commentContent",
      label: "pages.traces.columns.commentContent",
    },
    {
      type: "categorical" as const,
      column: "tags",
      label: "pages.traces.columns.tags",
    },
    {
      type: "categorical" as const,
      column: "level",
      label: "pages.traces.columns.level",
    },
    {
      type: "numeric" as const,
      column: "latency",
      label: "pages.traces.columns.latency",
      min: 0,
      max: 60,
      unit: "s",
    },
    {
      type: "numeric" as const,
      column: "inputTokens",
      label: "pages.traces.columns.inputTokens",
      min: 0,
      max: 1000000,
    },
    {
      type: "numeric" as const,
      column: "outputTokens",
      label: "pages.traces.columns.outputTokens",
      min: 0,
      max: 1000000,
    },
    {
      type: "numeric" as const,
      column: "totalTokens",
      label: "pages.traces.columns.totalTokens",
      min: 0,
      max: 1000000,
    },
    {
      type: "numeric" as const,
      column: "inputCost",
      label: "dashboard.widgets.measures.inputCost",
      min: 0,
      max: 100,
      unit: "$",
    },
    {
      type: "numeric" as const,
      column: "outputCost",
      label: "dashboard.widgets.measures.outputCost",
      min: 0,
      max: 100,
      unit: "$",
    },
    {
      type: "numeric" as const,
      column: "totalCost",
      label: "dashboard.widgets.measures.totalCost",
      min: 0,
      max: 100,
      unit: "$",
    },
    {
      type: "keyValue" as const,
      column: "score_categories",
      label: "pages.traces.columns.categoricalScores",
    },
    {
      type: "numericKeyValue" as const,
      column: "scores_avg",
      label: "pages.traces.columns.numericScores",
    },
  ],
};
