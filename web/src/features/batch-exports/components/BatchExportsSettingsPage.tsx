import Header from "@/src/components/layouts/header";
import { Alert, AlertDescription, AlertTitle } from "@/src/components/ui/alert";
import { BatchExportsTable } from "@/src/features/batch-exports/components/BatchExportsTable";
import { useHasProjectAccess } from "@/src/features/rbac/utils/checkProjectAccess";
import { SettingsTableCard } from "@/src/components/layouts/settings-table-card";
import { useTranslation } from "@/src/features/i18n";

export function BatchExportsSettingsPage(props: { projectId: string }) {
  const { t } = useTranslation();
  const hasAccess = useHasProjectAccess({
    projectId: props.projectId,
    scope: "batchExports:read",
  });

  return (
    <>
      <Header title={t("batchExports.title")} />
      <p className="mb-4 text-sm">
        {t("batchExports.description")}
      </p>
      {hasAccess ? (
        <SettingsTableCard>
          <BatchExportsTable projectId={props.projectId} />
        </SettingsTableCard>
      ) : (
        <Alert>
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You do not have permission to view batch exports.
          </AlertDescription>
        </Alert>
      )}
    </>
  );
}
