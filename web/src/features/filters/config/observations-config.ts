import { observationsTableCols } from "@langfuse/shared";
import type { FilterConfig } from "@/src/features/filters/lib/filter-config";
import type { ColumnToBackendKeyMap } from "@/src/features/filters/lib/filter-transform";

/**
 * Maps frontend column IDs to backend-expected column IDs
 * Frontend uses "tags" but backend CH mapping expects "traceTags" for trace tags on observations table
 */
export const OBSERVATION_COLUMN_TO_BACKEND_KEY: ColumnToBackendKeyMap = {
  tags: "traceTags",
};

export const observationFilterConfig: FilterConfig = {
  tableName: "observations",

  columnDefinitions: observationsTableCols,

  defaultExpanded: ["environment", "name"],

  facets: [
    {
      type: "categorical" as const,
      column: "environment",
      label: "pages.observations.columns.environment",
    },
    {
      type: "categorical" as const,
      column: "type",
      label: "pages.observations.columns.type",
    },
    {
      type: "categorical" as const,
      column: "name",
      label: "pages.observations.columns.name",
    },
    {
      type: "categorical" as const,
      column: "traceName",
      label: "pages.observations.columns.traceName",
    },
    {
      type: "categorical" as const,
      column: "level",
      label: "pages.observations.columns.level",
    },
    {
      type: "categorical" as const,
      column: "model",
      label: "pages.observations.columns.model",
    },
    {
      type: "categorical" as const,
      column: "modelId",
      label: "pages.observations.columns.modelId",
    },
    {
      type: "categorical" as const,
      column: "promptName",
      label: "pages.observations.columns.promptName",
    },
    {
      type: "categorical" as const,
      column: "tags",
      label: "pages.observations.columns.traceTags",
    },
    {
      type: "stringKeyValue" as const,
      column: "metadata",
      label: "pages.observations.columns.metadata",
    },
    {
      type: "string" as const,
      column: "version",
      label: "pages.observations.columns.version",
    },
    {
      type: "numeric" as const,
      column: "latency",
      label: "pages.observations.columns.latency",
      min: 0,
      max: 60,
      unit: "s",
    },
    {
      type: "numeric" as const,
      column: "timeToFirstToken",
      label: "pages.observations.columns.timeToFirstToken",
      min: 0,
      max: 60,
      unit: "s",
    },
    {
      type: "numeric" as const,
      column: "inputTokens",
      label: "pages.observations.columns.inputTokens",
      min: 0,
      max: 1000000,
    },
    {
      type: "numeric" as const,
      column: "outputTokens",
      label: "pages.observations.columns.outputTokens",
      min: 0,
      max: 1000000,
    },
    {
      type: "numeric" as const,
      column: "totalTokens",
      label: "pages.observations.columns.totalTokens",
      min: 0,
      max: 1000000,
    },
    {
      type: "numeric" as const,
      column: "inputCost",
      label: "pages.observations.columns.inputCost",
      min: 0,
      max: 100,
      unit: "$",
    },
    {
      type: "numeric" as const,
      column: "outputCost",
      label: "pages.observations.columns.outputCost",
      min: 0,
      max: 100,
      unit: "$",
    },
    {
      type: "numeric" as const,
      column: "totalCost",
      label: "pages.observations.columns.totalCost",
      min: 0,
      max: 100,
      unit: "$",
    },
    {
      type: "categorical" as const,
      column: "toolNames",
      label: "pages.observations.columns.toolNames",
    },
    {
      type: "categorical" as const,
      column: "calledToolNames",
      label: "pages.observations.columns.calledToolNames",
    },
    {
      type: "numeric" as const,
      column: "toolDefinitions",
      label: "pages.observations.columns.toolDefinitions",
      min: 0,
      max: 25,
    },
    {
      type: "numeric" as const,
      column: "toolCalls",
      label: "pages.observations.columns.toolCalls",
      min: 0,
      max: 25,
    },
    {
      type: "keyValue" as const,
      column: "score_categories",
      label: "pages.observations.columns.categoricalScores",
    },
    {
      type: "numericKeyValue" as const,
      column: "scores_avg",
      label: "pages.observations.columns.numericScores",
    },
    {
      type: "numeric" as const,
      column: "commentCount",
      label: "pages.observations.columns.commentCount",
      min: 0,
      max: 100,
    },
    {
      type: "string" as const,
      column: "commentContent",
      label: "pages.observations.columns.commentContent",
    },
  ],
};
