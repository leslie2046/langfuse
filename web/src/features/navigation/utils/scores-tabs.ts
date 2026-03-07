export const SCORES_TABS = {
  SCORES: "scores",
  ANALYTICS: "analytics",
} as const;

export type ScoresTab = (typeof SCORES_TABS)[keyof typeof SCORES_TABS];

export const getScoresTabs = (
  projectId: string,
  t: (key: string) => string,
) => [
  {
    value: SCORES_TABS.SCORES,
    label: t("navigation.scores"),
    href: `/project/${projectId}/scores`,
  },
  {
    value: SCORES_TABS.ANALYTICS,
    label: t("dashboard.scoresAnalytics.title"), // Reusing existing key or similar
    href: `/project/${projectId}/scores/analytics`,
  },
];
