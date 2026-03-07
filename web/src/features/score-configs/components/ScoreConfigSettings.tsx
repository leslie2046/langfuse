import React from "react";
import Header from "@/src/components/layouts/header";
import { useHasProjectAccess } from "@/src/features/rbac/utils/checkProjectAccess";
import { ScoreConfigsTable } from "@/src/components/table/use-cases/score-configs";
import { useTranslation } from "@/src/features/i18n";

export function ScoreConfigSettings({ projectId }: { projectId: string }) {
  const { t } = useTranslation();
  const hasReadAccess = useHasProjectAccess({
    projectId: projectId,
    scope: "scoreConfigs:read",
  });

  if (!hasReadAccess) return null;

  return (
    <div id="score-configs">
      <Header title={t("scoreConfigs.title")} />
      <p className="mb-2 text-sm">
        {t("scoreConfigs.description_part1")}{" "}
        <a
          href="https://langfuse.com/docs/evaluation/evaluation-methods/annotation"
          className="underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t("scoreConfigs.annotation")}
        </a>{" "}
        {t("scoreConfigs.description_part2")}
      </p>
      <ScoreConfigsTable projectId={projectId} />
    </div>
  );
}
