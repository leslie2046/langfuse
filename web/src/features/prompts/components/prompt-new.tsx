import { StringParam, useQueryParam } from "use-query-params";
import { NewPromptForm } from "@/src/features/prompts/components/NewPromptForm";
import useProjectIdFromURL from "@/src/hooks/useProjectIdFromURL";
import { api } from "@/src/utils/api";
import Page from "@/src/components/layouts/page";

import { useTranslation } from "@/src/features/i18n";

export const NewPrompt = () => {
  const projectId = useProjectIdFromURL();
  const [initialPromptId] = useQueryParam("promptId", StringParam);
  const { t } = useTranslation();

  const { data: initialPrompt, isInitialLoading } = api.prompts.byId.useQuery(
    {
      projectId: projectId as string, // Typecast as query is enabled only when projectId is present
      id: initialPromptId ?? "",
    },
    {
      enabled: Boolean(initialPromptId && projectId),
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  );

  if (isInitialLoading) {
    return <div className="p-3">Loading...</div>;
  }

  const breadcrumb: { name: string; href?: string }[] = [
    {
      name: t("pages.prompts.title"),
      href: `/project/${projectId}/prompts/`,
    },
    {
      name: t("pages.prompts.newPrompt"),
    },
  ];

  if (initialPrompt) {
    breadcrumb.pop(); // Remove "New prompt"
    breadcrumb.push(
      {
        name: initialPrompt.name,
        href: `/project/${projectId}/prompts/${encodeURIComponent(initialPrompt.name)}`,
      },
      { name: t("pages.prompts.newVersion") },
    );
  }

  return (
    <Page
      withPadding
      scrollable
      headerProps={{
        title: initialPrompt
          ? `${initialPrompt.name} \u2014 ${t("pages.prompts.newVersion")}`
          : t("pages.prompts.form.createPrompt"),
        help: {
          description: t("pages.prompts.helpDescription"),
          href: "https://langfuse.com/docs/prompts",
        },
        breadcrumb: breadcrumb,
      }}
    >
      {initialPrompt ? (
        <p className="text-sm text-muted-foreground">
          {t("pages.prompts.immutableNotice")}
        </p>
      ) : null}
      <div className="my-8">
        <NewPromptForm {...{ initialPrompt }} />
      </div>
    </Page>
  );
};
