import Header from "@/src/components/layouts/header";
import { Alert, AlertDescription, AlertTitle } from "@/src/components/ui/alert";
import { AuditLogsTable } from "@/src/ee/features/audit-log-viewer/AuditLogsTable";
import { useHasEntitlement } from "@/src/features/entitlements/hooks";
import { useHasProjectAccess } from "@/src/features/rbac/utils/checkProjectAccess";
import { useTranslation } from "@/src/features/i18n";

export function AuditLogsSettingsPage(props: { projectId: string }) {
  const hasAccess = useHasProjectAccess({
    projectId: props.projectId,
    scope: "auditLogs:read",
  });
  const hasEntitlement = useHasEntitlement("audit-logs");
  const { t } = useTranslation();

  const body = !hasEntitlement ? (
    <p className="text-muted-foreground text-sm">{t("auditLogs.enterprise")}</p>
  ) : !hasAccess ? (
    <Alert>
      <AlertTitle>{t("auditLogs.accessDenied.title")}</AlertTitle>
      <AlertDescription>
        {t("auditLogs.accessDenied.description")}
      </AlertDescription>
    </Alert>
  ) : (
    <AuditLogsTable scope="project" projectId={props.projectId} />
  );

  return (
    <>
      <Header title={t("auditLogs.title")} />
      <p className="text-muted-foreground mb-2 text-sm">
        {t("auditLogs.description")}
      </p>
      {body}
    </>
  );
}
