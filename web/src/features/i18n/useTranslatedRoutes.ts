import { useMemo } from "react";
import { useTranslation } from "@/src/features/i18n";
import { ROUTES, type Route, RouteGroup } from "@/src/components/layouts/routes";

// Map route titles to translation keys
const titleKeyMap: Record<string, string> = {
  "Go to...": "navigation.goTo",
  "Organizations": "navigation.organizations",
  "Projects": "navigation.projects",
  "Home": "navigation.home",
  "Dashboards": "navigation.dashboards",
  "Tracing": "navigation.tracing",
  "Sessions": "navigation.sessions",
  "Users": "navigation.users",
  "Prompts": "navigation.prompts",
  "Playground": "navigation.playground",
  "Scores": "navigation.scores",
  "LLM-as-a-Judge": "navigation.llmAsAJudge",
  "Human Annotation": "navigation.humanAnnotation",
  "Datasets": "navigation.datasets",
  "Upgrade": "navigation.upgrade",
  "Cloud Status": "navigation.cloudStatus",
  "v4 Beta Toggle": "navigation.v4BetaToggle",
  "Settings": "navigation.settings",
  "Book a call": "navigation.bookACall",
  "Support": "navigation.support",
};

// Map group names to translation keys
const groupKeyMap: Record<string, string> = {
  "Observability": "groups.observability",
  "Prompt Management": "groups.promptManagement",
  "Evaluation": "groups.evaluation",
};

export function useTranslatedRoutes(): Route[] {
  const { t } = useTranslation();

  return useMemo(() => {
    return ROUTES.map((route) => ({
      ...route,
      title: t(titleKeyMap[route.title] ?? route.title),
      group: route.group
        ? (t(groupKeyMap[route.group] ?? route.group) as unknown as RouteGroup)
        : undefined,
    }));
  }, [t]);
}
