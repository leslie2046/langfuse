import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useQueryParams, StringParam } from "use-query-params";
import TracesTable from "@/src/components/table/use-cases/traces";
import Page from "@/src/components/layouts/page";
import { api } from "@/src/utils/api";
import { TracesOnboarding } from "@/src/components/onboarding/TracesOnboarding";
import {
  getTracingTabs,
  TRACING_TABS,
} from "@/src/features/navigation/utils/tracing-tabs";
import { useV4Beta } from "@/src/features/events/hooks/useV4Beta";
import ObservationsEventsTable from "@/src/features/events/components/EventsTable";
import { useTranslation } from "@/src/features/i18n";
import { useQueryProject } from "@/src/features/projects/hooks";

export default function Traces() {
  const router = useRouter();
  const projectId = router.query.projectId as string;
  const { isBetaEnabled } = useV4Beta();
  const { t } = useTranslation();
  const [, setQueryParams] = useQueryParams({ viewMode: StringParam });
  const { project } = useQueryProject();

  // Clear viewMode query when beta is turned off (e.g. from sidebar)
  useEffect(() => {
    if (!isBetaEnabled) {
      setQueryParams({ viewMode: undefined });
    }
  }, [isBetaEnabled, setQueryParams]);

  // Check if the user has tracing configured
  // Skip polling entirely if the project flag is already set in the session
  const { data: hasTracingConfigured, isLoading } =
    api.traces.hasTracingConfigured.useQuery(
      { projectId },
      {
        enabled: !!projectId,
        trpc: {
          context: {
            skipBatch: true,
          },
        },
        refetchInterval: project?.hasTraces ? false : 10_000,
        initialData: project?.hasTraces ? true : undefined,
        staleTime: project?.hasTraces ? Infinity : 0,
      },
    );

  const showOnboarding = !isLoading && !hasTracingConfigured;

  if (showOnboarding) {
    return (
      <Page
        headerProps={{
          title: t("pages.traces.title"),
          help: {
            description: t("pages.traces.helpDescription"),
            href: "https://langfuse.com/docs/observability/data-model",
          },
        }}
        scrollable
      >
        <TracesOnboarding projectId={projectId} />
      </Page>
    );
  }

  return (
    <Page
      headerProps={{
        title: t("pages.traces.title"),
        help: {
          description: (
            <>
              {
                t("pages.traces.helpDescription").split(
                  t("pages.traces.docs"),
                )[0]
              }
              <a
                href="https://langfuse.com/docs/observability/data-model"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-primary/30 hover:decoration-primary"
                onClick={(e) => e.stopPropagation()}
              >
                {t("pages.traces.docs")}
              </a>
              {t("pages.traces.helpDescription").split(
                t("pages.traces.docs"),
              )[1] || ""}
            </>
          ),
          href: "https://langfuse.com/docs/observability/data-model",
        },
        tabsProps: isBetaEnabled
          ? undefined
          : {
              tabs: getTracingTabs(projectId),
              activeTab: TRACING_TABS.TRACES,
            },
      }}
    >
      {isBetaEnabled ? (
        <ObservationsEventsTable projectId={projectId} />
      ) : (
        <TracesTable projectId={projectId} />
      )}
    </Page>
  );
}
