import { z } from "zod/v4";
import { dashboardColumnDefinitions, singleFilter } from "@langfuse/shared";
import { type views } from "@/src/features/query/types";

// Exported to silence @typescript-eslint/no-unused-vars v8 warning
// (used for type extraction via typeof, which is a legitimate pattern)
export const FilterArray = z.array(singleFilter);

type LegacyViewMapping = {
  legacyColumn: string;
  viewName: string;
};

const viewMappings: Record<z.infer<typeof views>, LegacyViewMapping[]> = {
  traces: [
    { legacyColumn: "Trace Name", viewName: "name" },
    { legacyColumn: "traceName", viewName: "name" },
    { legacyColumn: "Observation Name", viewName: "observationName" },
    { legacyColumn: "observationName", viewName: "observationName" },
    { legacyColumn: "Score Name", viewName: "scoreName" },
    { legacyColumn: "scoreName", viewName: "scoreName" },
    { legacyColumn: "Tags", viewName: "tags" },
    { legacyColumn: "tags", viewName: "tags" },
    { legacyColumn: "traceTags", viewName: "tags" },
    { legacyColumn: "User", viewName: "userId" },
    { legacyColumn: "user", viewName: "userId" },
    { legacyColumn: "Session", viewName: "sessionId" },
    { legacyColumn: "session", viewName: "sessionId" },
    { legacyColumn: "Metadata", viewName: "metadata" },
    { legacyColumn: "metadata", viewName: "metadata" },
    { legacyColumn: "Release", viewName: "release" },
    { legacyColumn: "release", viewName: "release" },
    { legacyColumn: "Version", viewName: "version" },
    { legacyColumn: "version", viewName: "version" },
    { legacyColumn: "Environment", viewName: "environment" },
    { legacyColumn: "environment", viewName: "environment" },
  ],
  observations: [
    { legacyColumn: "Trace Name", viewName: "traceName" },
    { legacyColumn: "traceName", viewName: "traceName" },
    { legacyColumn: "Observation Name", viewName: "name" },
    { legacyColumn: "observationName", viewName: "name" },
    { legacyColumn: "Score Name", viewName: "scoreName" },
    { legacyColumn: "scoreName", viewName: "scoreName" },
    { legacyColumn: "User", viewName: "userId" },
    { legacyColumn: "user", viewName: "userId" },
    { legacyColumn: "Session", viewName: "sessionId" },
    { legacyColumn: "session", viewName: "sessionId" },
    { legacyColumn: "Metadata", viewName: "metadata" },
    { legacyColumn: "metadata", viewName: "metadata" },
    { legacyColumn: "Type", viewName: "type" },
    { legacyColumn: "type", viewName: "type" },
    { legacyColumn: "Tags", viewName: "tags" },
    { legacyColumn: "tags", viewName: "tags" },
    { legacyColumn: "Model", viewName: "providedModelName" },
    { legacyColumn: "model", viewName: "providedModelName" },
    { legacyColumn: "Tool Names", viewName: "toolNames" },
    { legacyColumn: "toolNames", viewName: "toolNames" },
    { legacyColumn: "Environment", viewName: "environment" },
    { legacyColumn: "environment", viewName: "environment" },
    { legacyColumn: "Release", viewName: "traceRelease" },
    { legacyColumn: "release", viewName: "traceRelease" },
    { legacyColumn: "Version", viewName: "traceVersion" },
    { legacyColumn: "version", viewName: "traceVersion" },
  ],
  "scores-numeric": [
    { legacyColumn: "Score Name", viewName: "name" },
    { legacyColumn: "scoreName", viewName: "name" },
    { legacyColumn: "Score Source", viewName: "source" },
    { legacyColumn: "scoreSource", viewName: "source" },
    { legacyColumn: "Score Value", viewName: "value" },
    { legacyColumn: "value", viewName: "value" },
    { legacyColumn: "Scores Data Type", viewName: "dataType" },
    { legacyColumn: "scoreDataType", viewName: "dataType" },
    { legacyColumn: "Tags", viewName: "tags" },
    { legacyColumn: "tags", viewName: "tags" },
    { legacyColumn: "Environment", viewName: "environment" },
    { legacyColumn: "environment", viewName: "environment" },
    { legacyColumn: "User", viewName: "userId" },
    { legacyColumn: "user", viewName: "userId" },
    { legacyColumn: "Session", viewName: "sessionId" },
    { legacyColumn: "session", viewName: "sessionId" },
    { legacyColumn: "Metadata", viewName: "metadata" },
    { legacyColumn: "metadata", viewName: "metadata" },
    { legacyColumn: "Trace Name", viewName: "traceName" },
    { legacyColumn: "traceName", viewName: "traceName" },
    { legacyColumn: "Observation Name", viewName: "observationName" },
    { legacyColumn: "observationName", viewName: "observationName" },
    { legacyColumn: "Release", viewName: "traceRelease" },
    { legacyColumn: "release", viewName: "traceRelease" },
    { legacyColumn: "Version", viewName: "traceVersion" },
    { legacyColumn: "version", viewName: "traceVersion" },
  ],
  "scores-categorical": [
    { legacyColumn: "Score Name", viewName: "name" },
    { legacyColumn: "scoreName", viewName: "name" },
    { legacyColumn: "Score Source", viewName: "source" },
    { legacyColumn: "scoreSource", viewName: "source" },
    { legacyColumn: "Score String Value", viewName: "stringValue" },
    { legacyColumn: "stringValue", viewName: "stringValue" },
    { legacyColumn: "Scores Data Type", viewName: "dataType" },
    { legacyColumn: "scoreDataType", viewName: "dataType" },
    { legacyColumn: "Tags", viewName: "tags" },
    { legacyColumn: "tags", viewName: "tags" },
    { legacyColumn: "Environment", viewName: "environment" },
    { legacyColumn: "environment", viewName: "environment" },
    { legacyColumn: "User", viewName: "userId" },
    { legacyColumn: "user", viewName: "userId" },
    { legacyColumn: "Session", viewName: "sessionId" },
    { legacyColumn: "session", viewName: "sessionId" },
    { legacyColumn: "Metadata", viewName: "metadata" },
    { legacyColumn: "metadata", viewName: "metadata" },
    { legacyColumn: "Trace Name", viewName: "traceName" },
    { legacyColumn: "traceName", viewName: "traceName" },
    { legacyColumn: "Observation Name", viewName: "observationName" },
    { legacyColumn: "observationName", viewName: "observationName" },
    { legacyColumn: "Release", viewName: "traceRelease" },
    { legacyColumn: "release", viewName: "traceRelease" },
    { legacyColumn: "Version", viewName: "traceVersion" },
    { legacyColumn: "version", viewName: "traceVersion" },
  ],
};

const extraLegacyDashboardMappings = [
  {
    uiTableName: "Session",
    uiTableId: "sessionId",
    clickhouseTableName: "traces",
    clickhouseSelect: 't."sessionId"',
  },
  {
    uiTableName: "Observation Name",
    uiTableId: "observationName",
    clickhouseTableName: "observations",
    clickhouseSelect: 'o."name"',
  },
  {
    uiTableName: "Metadata",
    uiTableId: "metadata",
    clickhouseTableName: "traces",
    clickhouseSelect: 't."metadata"',
  },
  {
    uiTableName: "Score Value",
    uiTableId: "value",
    clickhouseTableName: "scores",
    clickhouseSelect: 's."value"',
  },
  {
    uiTableName: "Score String Value",
    uiTableId: "stringValue",
    clickhouseTableName: "scores",
    clickhouseSelect: 's."string_value"',
  },
] as const;

const legacyDashboardColumns = dashboardColumnDefinitions.concat(
  extraLegacyDashboardMappings,
);

const legacyDashboardColumnSet = new Set(
  legacyDashboardColumns.flatMap((columnDef) => [
    columnDef.uiTableId,
    columnDef.uiTableName,
  ]),
);

const legacyAliases = new Set(["user", "session"]);

const isLegacyUiTableFilter = (
  filter: z.infer<typeof singleFilter>,
): boolean => {
  return (
    legacyDashboardColumnSet.has(filter.column) ||
    legacyAliases.has(filter.column)
  );
};

export const mapLegacyUiTableFilterToView = (
  view: z.infer<typeof views>,
  filters: z.infer<typeof FilterArray>,
): z.infer<typeof FilterArray> => {
  return filters.flatMap((filter) => {
    if (!isLegacyUiTableFilter(filter)) {
      return [filter];
    }

    const definition = viewMappings[view].find(
      (def) => def.legacyColumn === filter.column,
    );

    if (!definition) {
      return [filter];
    }

    return [{ ...filter, column: definition.viewName }];
  });
};
