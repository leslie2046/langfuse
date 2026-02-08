import { useState } from "react";
import { useRouter } from "next/router";
import { api } from "@/src/utils/api";
import Page from "@/src/components/layouts/page";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Label } from "@/src/components/ui/label";
import { showSuccessToast } from "@/src/features/notifications/showSuccessToast";
import { showErrorToast } from "@/src/features/notifications/showErrorToast";
import { useHasProjectAccess } from "@/src/features/rbac/utils/checkProjectAccess";
import { useTranslation } from "@/src/features/i18n";

export default function NewDashboard() {
  const router = useRouter();
  const { projectId } = router.query as { projectId: string };
  const { t } = useTranslation();

  // State for new dashboard
  const [dashboardName, setDashboardName] = useState(
    t("pages.dashboards.create.title"),
  );
  const [dashboardDescription, setDashboardDescription] = useState("");

  // Check project access
  const hasCUDAccess = useHasProjectAccess({
    projectId,
    scope: "dashboards:CUD",
  });

  // Mutation for creating a new dashboard
  const createDashboard = api.dashboard.createDashboard.useMutation({
    onSuccess: (data) => {
      showSuccessToast({
        title: t("pages.dashboards.create.successTitle"),
        description: t("pages.dashboards.create.successDescription"),
      });
      // Navigate to the newly created dashboard
      router.push(`/project/${projectId}/dashboards/${data.id}`);
    },
    onError: (error) => {
      showErrorToast(t("pages.dashboards.create.errorTitle"), error.message);
    },
  });

  // Handle form submission
  const handleCreateDashboard = () => {
    if (dashboardName.trim()) {
      createDashboard.mutate({
        projectId,
        name: dashboardName,
        description: dashboardDescription,
      });
    } else {
      showErrorToast(
        t("pages.dashboards.create.validationError"),
        t("pages.dashboards.create.nameRequired"),
      );
    }
  };

  return (
    <Page
      withPadding
      headerProps={{
        title: t("pages.dashboards.create.title"),
        help: {
          description: t("pages.dashboards.create.description"),
        },
        actionButtonsRight: (
          <>
            <Button
              variant="outline"
              onClick={() => router.push(`/project/${projectId}/dashboards`)}
            >
              {t("pages.dashboards.create.cancel")}
            </Button>
            <Button
              onClick={handleCreateDashboard}
              disabled={
                !dashboardName.trim() ||
                createDashboard.isPending ||
                !hasCUDAccess
              }
              loading={createDashboard.isPending}
            >
              {t("pages.dashboards.create.create")}
            </Button>
          </>
        ),
      }}
    >
      <div className="mx-auto my-8 max-w-xl space-y-6">
        <div className="space-y-2">
          <Label htmlFor="dashboard-name">
            {t("pages.dashboards.create.nameLabel")}
          </Label>
          <Input
            id="dashboard-name"
            value={dashboardName}
            onChange={(e) => {
              setDashboardName(e.target.value);
            }}
            placeholder={t("pages.dashboards.create.namePlaceholder")}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dashboard-description">
            {t("pages.dashboards.create.descLabel")}
          </Label>
          <Textarea
            id="dashboard-description"
            value={dashboardDescription}
            onChange={(e) => {
              setDashboardDescription(e.target.value);
            }}
            placeholder={t("pages.dashboards.create.descPlaceholder")}
            rows={4}
          />
        </div>

        <div className="text-sm text-muted-foreground">
          <p>{t("pages.dashboards.create.helpText")}</p>
        </div>
      </div>
    </Page>
  );
}
