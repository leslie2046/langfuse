import startCase from "lodash/startCase";
import { type FilterState } from "@langfuse/shared";
import { type DashboardWidgetChartType } from "@langfuse/shared/src/db";

// Shared widget chart configuration types
export type WidgetChartConfig = {
  type: DashboardWidgetChartType;
  row_limit?: number;
  bins?: number;
  defaultSort?: {
    column: string;
    order: "ASC" | "DESC";
  };
};

/**
 * Formats a metric name for display, handling special cases like count_count -> Count
 */
export function formatMetricName(
  metricName: string,
  t: (key: string) => string,
): string {
  // Handle the count_count -> Count conversion
  const cleanedName = metricName === "count_count" ? "count" : metricName;
  if (cleanedName.includes("_")) {
    const [agg, meas] = cleanedName.split("_");
    return `${t(`dashboard.widgets.aggregations.${agg}`)} ${t(
      `dashboard.widgets.measures.${meas}`,
    )}`;
  }
  return t(`dashboard.widgets.measures.${cleanedName}`);
}

/**
 * Formats multiple metric names for display, showing first 3 and "+ X more" if needed
 */
export function formatMultipleMetricNames(
  metricNames: string[],
  t: (key: string, options?: any) => string,
): string {
  if (metricNames.length === 0) return t("dashboard.widgets.dataSelection.none");
  if (metricNames.length === 1) return formatMetricName(metricNames[0], t);

  const formattedNames = metricNames.map((n) => formatMetricName(n, t));

  if (metricNames.length <= 3) {
    return formattedNames.join(", ");
  }

  const firstThree = formattedNames.slice(0, 3).join(", ");
  const remaining = metricNames.length - 3;
  return `${firstThree} + ${remaining} ${t("dashboard.widgets.dataSelection.more")}`;
}

export function buildWidgetName({
  aggregation,
  measure,
  dimension,
  view,
  metrics,
  t,
  isMultiMetric = false,
}: {
  aggregation: string;
  measure: string;
  dimension: string;
  view: string;
  metrics?: string[];
  t: (key: string, options?: any) => string;
  isMultiMetric?: boolean;
}) {
  let base: string;

  if (isMultiMetric && metrics && metrics.length > 0) {
    // Handle multi-metric scenarios (like pivot tables)
    const metricDisplay = formatMultipleMetricNames(metrics, t);
    base = metricDisplay;
  } else {
    // Handle single metric scenarios (existing logic)
    const meas = t(`dashboard.widgets.measures.${measure}`);
    if (measure.toLowerCase() === "count") {
      // For count measures, ignore aggregation and only show the measure
      base = meas;
    } else {
      const agg = t(`dashboard.widgets.aggregations.${aggregation}`);
      base = `${agg} ${meas}`;
    }
  }

  if (dimension && dimension !== "none" && dimension !== t("dashboard.widgets.dataSelection.none")) {
    base += ` ${t("dashboard.widgets.dataSelection.by")} ${dimension}`;
  }
  base += ` (${t(`dashboard.widgets.views.${view}`)})`;
  return base;
}

export function buildWidgetDescription({
  aggregation,
  measure,
  dimension,
  view,
  filters,
  metrics,
  t,
  isMultiMetric = false,
}: {
  aggregation: string;
  measure: string;
  dimension: string;
  view: string;
  filters: FilterState;
  metrics?: string[];
  t: (key: string, options?: any) => string;
  isMultiMetric?: boolean;
}) {
  const viewLabel = t(`dashboard.widgets.views.${view}`);
  let sentence: string;

  if (isMultiMetric && metrics && metrics.length > 0) {
    // Handle multi-metric scenarios
    const metricDisplay = formatMultipleMetricNames(metrics, t);
    sentence = `${t("dashboard.widgets.dataSelection.shows")} ${metricDisplay} ${t(
      "dashboard.widgets.dataSelection.of",
    )} ${viewLabel}`;
  } else {
    // Handle single metric scenarios (existing logic)
    const measLabel = t(`dashboard.widgets.measures.${measure}`);

    if (measure.toLowerCase() === "count") {
      sentence = `${t("dashboard.widgets.dataSelection.showsCountOf")} ${viewLabel}`;
    } else {
      const aggLabel = t(`dashboard.widgets.aggregations.${aggregation}`);
      sentence = `${t(
        "dashboard.widgets.dataSelection.showsThe",
      )} ${aggLabel} ${measLabel} ${t(
        "dashboard.widgets.dataSelection.of",
      )} ${viewLabel}`;
    }
  }

  // Dimension clause
  if (dimension && dimension !== "none" && dimension !== t("dashboard.widgets.dataSelection.none")) {
    sentence += ` ${t("dashboard.widgets.dataSelection.by")} ${dimension.toLowerCase()}`;
  }

  // Filters clause
  if (filters && filters.length > 0) {
    if (filters.length <= 2) {
      const cols = filters
        .map((f) => t(`dashboard.widgets.dimensions.${f.column}`))
        .join(` ${t("dashboard.widgets.dataSelection.and")} `);
      sentence += `, ${t("dashboard.widgets.dataSelection.filteredBy")} ${cols}`;
    } else {
      sentence += `, ${t("dashboard.widgets.dataSelection.filteredBy")} ${
        filters.length
      } ${t("dashboard.widgets.dataSelection.conditions")}`;
    }
  }

  return sentence;
}
