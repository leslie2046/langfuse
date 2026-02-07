import React, { useState } from "react";
import { api } from "@/src/utils/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogBody,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { showSuccessToast } from "@/src/features/notifications/showSuccessToast";
import { showErrorToast } from "@/src/features/notifications/showErrorToast";

import { useTranslation } from "@/src/features/i18n";

interface EditDashboardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  dashboardId: string;
  initialName: string;
  initialDescription: string;
}

export function EditDashboardDialog({
  open,
  onOpenChange,
  projectId,
  dashboardId,
  initialName,
  initialDescription,
}: EditDashboardDialogProps) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const utils = api.useUtils();
  const { t } = useTranslation();

  const updateDashboard = api.dashboard.updateDashboardMetadata.useMutation({
    onSuccess: () => {
      void utils.dashboard.invalidate();
      showSuccessToast({
        title: t("pages.dashboards.edit.successTitle"),
        description: t("pages.dashboards.edit.successDescription"),
      });
      onOpenChange(false);
    },
    onError: (e) => {
      showErrorToast("Failed to update dashboard", e.message);
    },
  });

  const handleSave = () => {
    if (!name.trim()) {
      showErrorToast(
        t("pages.dashboards.create.validationError"),
        t("pages.dashboards.create.nameRequired"),
      );
      return;
    }

    updateDashboard.mutate({
      projectId,
      dashboardId,
      name: name.trim(),
      description: description.trim(),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("pages.dashboards.edit.title")}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">{t("pages.dashboards.edit.name")}</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("pages.dashboards.create.namePlaceholder")}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">{t("pages.dashboards.edit.description")}</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t("pages.dashboards.create.descPlaceholder")}
                rows={3}
              />
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <div className="flex gap-2">
            <Button
              onClick={() => onOpenChange(false)}
              variant="outline"
              type="button"
            >
              {t("pages.dashboards.edit.cancel")}
            </Button>
            <Button
              onClick={handleSave}
              type="button"
              loading={updateDashboard.isPending}
            >
              {t("pages.dashboards.edit.save")}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
