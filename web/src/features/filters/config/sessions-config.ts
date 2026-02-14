import { sessionsViewCols } from "@langfuse/shared";
import type { FilterConfig } from "@/src/features/filters/lib/filter-config";
import type { ColumnToBackendKeyMap } from "@/src/features/filters/lib/filter-transform";

/**
 * Maps frontend column IDs to backend-expected column IDs
 * Frontend uses "tags" but backend CH mapping expects "traceTags" for trace tags on sessions table
 */
export const SESSION_COLUMN_TO_BACKEND_KEY: ColumnToBackendKeyMap = {
  tags: "traceTags",
};

export const sessionFilterConfig: FilterConfig = {
  tableName: "sessions",

  columnDefinitions: sessionsViewCols,

  defaultExpanded: ["environment", "bookmarked"],

  facets: [
    {
      type: "categorical" as const,
      column: "environment",
      label: "common.filters.environment",
    },
    {
      type: "string" as const,
      column: "id",
      label: "pages.sessions.columns.id",
    },
    {
      type: "categorical" as const,
      column: "userIds",
      label: "pages.sessions.columns.userIds",
    },
    {
      type: "categorical" as const,
      column: "tags",
      label: "pages.sessions.columns.traceTags",
    },
    {
      type: "boolean" as const,
      column: "bookmarked",
      label: "common.filters.bookmarked",
      trueLabel: "common.filters.bookmarked",
      falseLabel: "common.filters.notBookmarked",
    },
    {
      type: "numeric" as const,
      column: "sessionDuration",
      label: "pages.sessions.columns.duration",
      min: 0,
      max: 3600,
      unit: "s",
    },
    {
      type: "numeric" as const,
      column: "countTraces",
      label: "pages.sessions.columns.traces",
      min: 0,
      max: 1000,
    },
    {
      type: "numeric" as const,
      column: "inputTokens",
      label: "pages.sessions.columns.inputTokens",
      min: 0,
      max: 1000000,
    },
    {
      type: "numeric" as const,
      column: "outputTokens",
      label: "pages.sessions.columns.outputTokens",
      min: 0,
      max: 1000000,
    },
    {
      type: "numeric" as const,
      column: "totalTokens",
      label: "pages.sessions.columns.totalTokens",
      min: 0,
      max: 1000000,
    },
    {
      type: "numeric" as const,
      column: "inputCost",
      label: "pages.sessions.columns.inputCost",
      min: 0,
      max: 100,
      unit: "$",
    },
    {
      type: "numeric" as const,
      column: "outputCost",
      label: "pages.sessions.columns.outputCost",
      min: 0,
      max: 100,
      unit: "$",
    },
    {
      type: "numeric" as const,
      column: "totalCost",
      label: "pages.sessions.columns.totalCost",
      min: 0,
      max: 100,
      unit: "$",
    },
    {
      type: "keyValue" as const,
      column: "score_categories",
      label: "pages.sessions.columns.categoricalScores",
    },
    {
      type: "numericKeyValue" as const,
      column: "scores_avg",
      label: "pages.sessions.columns.numericScores",
    },
    {
      type: "numeric" as const,
      column: "commentCount",
      label: "pages.sessions.columns.commentCount",
      min: 0,
      max: 100,
    },
    {
      type: "string" as const,
      column: "commentContent",
      label: "pages.sessions.columns.commentContent",
    },
  ],
};
