import { useHasProjectAccess } from "@/src/features/rbac/utils/checkProjectAccess";
import { ModelParameters } from "@/src/components/ModelParameters";
import { CardContent } from "@/src/components/ui/card";
import { Card } from "@/src/components/ui/card";
import { useModelParams } from "@/src/features/playground/page/hooks/useModelParams";
import { Button } from "@/src/components/ui/button";
import { api } from "@/src/utils/api";
import { showSuccessToast } from "@/src/features/notifications/showSuccessToast";
import { Skeleton } from "@/src/components/ui/skeleton";
import { useEvaluationModel } from "@/src/features/evals/hooks/useEvaluationModel";
import { DeleteEvaluationModelButton } from "@/src/components/deleteButton";
import { ManageDefaultEvalModel } from "@/src/features/evals/components/manage-default-eval-model";
import { useState } from "react";
import { DialogContent, DialogTrigger } from "@/src/components/ui/dialog";
import { getFinalModelParams } from "@/src/utils/getFinalModelParams";
import { Dialog } from "@/src/components/ui/dialog";
import { Pencil } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import { Label } from "@/src/components/ui/label";
import { Input } from "@/src/components/ui/input";
import { useTranslation } from "@/src/features/i18n";

export function DefaultEvalModelSetup({ projectId }: { projectId: string }) {
  const utils = api.useUtils();
  const [isEditing, setIsEditing] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const { t } = useTranslation();

  const hasWriteAccess = useHasProjectAccess({
    projectId,
    scope: "evalDefaultModel:CUD",
  });

  const {
    modelParams,
    setModelParams,
    updateModelParamValue,
    setModelParamEnabled,
    availableModels,
    providerModelCombinations,
    availableProviders,
  } = useModelParams();

  const { selectedModel, isDefaultModelLoading } = useEvaluationModel(
    projectId,
    setModelParams,
  );

  const { mutateAsync: upsertDefaultModel, isPending: isUpsertLoading } =
    api.defaultLlmModel.upsertDefaultModel.useMutation({
      onSuccess: () => {
        showSuccessToast({
          title: t("evaluators.defaultModel.updatedToastTitle"),
          description: t("evaluators.defaultModel.updatedToastDescription"),
        });

        utils.defaultLlmModel.fetchDefaultModel.invalidate({ projectId });
        setFormError(null);
        setIsEditing(false);
      },
      onError: (error) => {
        setFormError(error.message as string);
      },
    });

  const executeUpsertMutation = async () => {
    await upsertDefaultModel({
      projectId,
      provider: modelParams.provider.value,
      adapter: modelParams.adapter.value,
      model: modelParams.model.value,
      modelParams: getFinalModelParams(modelParams),
    });
  };

  if (isDefaultModelLoading) {
    return <Skeleton className="h-[500px] w-full" />;
  }

  return (
    <>
      <Card className="mt-3 flex flex-col gap-6">
        <CardContent>
          <p className="my-2 text-lg font-semibold">{t("evaluators.defaultModel.title")}</p>
          <ManageDefaultEvalModel
            projectId={projectId}
            variant="color-coded"
            setUpMessage={t("evaluators.defaultModel.setUpMessage")}
            className="text-sm font-normal"
            showEditButton={false}
          />
        </CardContent>
      </Card>

      <div className="mt-2 flex justify-end gap-2">
        {selectedModel && (
          <DeleteEvaluationModelButton
            projectId={projectId}
            scope="evalDefaultModel:CUD"
          />
        )}

        <Dialog
          open={isEditing}
          onOpenChange={(open) => {
            setIsEditing(open);
            if (!open) {
              setFormError(null);
            }
          }}
        >
          <DialogTrigger asChild>
            <Button
              disabled={!hasWriteAccess}
              onClick={() => {
                setIsEditing(true);
              }}
            >
              <Pencil className="mr-2 h-4 w-4" />
              {selectedModel ? t("common.edit") : t("evaluators.defaultModel.setUp")}
            </Button>
          </DialogTrigger>
          <DialogContent className="px-3 py-10">
            <ModelParameters
              customHeader={
                <p className="font-medium leading-none">
                  {t("evaluators.defaultModel.configuration")}
                </p>
              }
              {...{
                modelParams,
                availableModels,
                providerModelCombinations,
                availableProviders,
                updateModelParamValue,
                setModelParamEnabled,
              }}
                formDisabled={!hasWriteAccess}
            />
            <div className="my-2 text-xs text-muted-foreground">
              {t("evaluators.defaultModel.functionCalling")}
            </div>
            <div className="flex flex-col gap-2">
              <div className="mt-2 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  {t("common.cancel")}
                </Button>
                {selectedModel ? (
                  <UpdateButton
                    projectId={projectId}
                    isLoading={isUpsertLoading}
                    executeUpsertMutation={executeUpsertMutation}
                  />
                ) : (
                  <Button
                    disabled={!hasWriteAccess || !modelParams.provider.value}
                    onClick={executeUpsertMutation}
                  >
                    {t("common.save")}
                  </Button>
                )}
              </div>
              {formError ? (
                <p className="text-red w-full text-center">
                  <span className="font-bold">{t("common.error")}:</span> {formError}
                </p>
              ) : null}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

function UpdateButton({
  projectId,
  isLoading,
  executeUpsertMutation,
}: {
  projectId: string;
  isLoading: boolean;
  executeUpsertMutation: () => void;
}) {
  const [confirmationInput, setConfirmationInput] = useState("");
  const hasWriteAccess = useHasProjectAccess({
    projectId,
    scope: "evalDefaultModel:CUD",
  });
  const { t } = useTranslation();

  const CONFIRMATION = "update";

  return (
    <Popover key="update-action">
      <PopoverTrigger asChild>
        <Button
          disabled={!hasWriteAccess}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {t("evaluators.defaultModel.update")}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        onClick={(e) => e.stopPropagation()}
        className="w-fit max-w-[500px]"
      >
        <h2 className="text-md mb-3 font-semibold">{t("evaluators.defaultModel.updateConfirmationTitle")}</h2>
        <p className="mb-3 text-sm">
          {t("evaluators.defaultModel.updateConfirmationDescription")}
        </p>
        <div className="mb-4 grid w-full gap-1.5">
          <Label htmlFor="update-confirmation">
            {t("evaluators.defaultModel.typeToConfirm", { confirmation: CONFIRMATION })}
          </Label>
          <Input
            id="update-confirmation"
            value={confirmationInput}
            onChange={(e) => setConfirmationInput(e.target.value)}
          />
        </div>
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            loading={isLoading}
            onClick={() => {
              if (confirmationInput !== CONFIRMATION) {
                alert("Please type the correct confirmation");
                return;
              }
              executeUpsertMutation();
            }}
          >
            {t("evaluators.defaultModel.confirm")}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
