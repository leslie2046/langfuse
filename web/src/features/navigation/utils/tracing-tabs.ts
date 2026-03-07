export const TRACING_TABS = {
  TRACES: "traces",
  OBSERVATIONS: "observations",
} as const;

export type TracingTab = (typeof TRACING_TABS)[keyof typeof TRACING_TABS];

export const getTracingTabs = (projectId: string) => [
  {
    value: TRACING_TABS.TRACES,
    label: "pages.dashboards.traces",
    href: `/project/${projectId}/traces`,
  },
  {
    value: TRACING_TABS.OBSERVATIONS,
    label: "pages.dashboards.observations",
    href: `/project/${projectId}/observations`,
  },
];
