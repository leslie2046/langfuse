import { AlertCircle, Settings } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/src/components/ui/alert";
import { useTranslation } from "@/src/features/i18n";

interface NoModelConfiguredAlertProps {
  projectId: string;
}

export function NoModelConfiguredAlert({
  projectId,
}: NoModelConfiguredAlertProps) {
  const { t } = useTranslation();

  return (
    <div className="p-4">
      <Alert
        variant="default"
        className="border-yellow-500/50 bg-yellow-50 dark:bg-yellow-950/20"
      >
        <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
        <AlertTitle className="text-yellow-800 dark:text-yellow-400">
          {t("playground.noModelConfigured.title")}
        </AlertTitle>
        <AlertDescription className="text-yellow-700 dark:text-yellow-500">
          {t("playground.noModelConfigured.descriptionPart1")}{" "}
          <Link
            href={`/project/${projectId}/settings/llm-connections`}
            className="font-medium underline underline-offset-4 hover:text-yellow-900 dark:hover:text-yellow-300"
          >
            <Settings className="inline h-3 w-3" />{" "}
            {t("playground.noModelConfigured.llmConnectionSettings")}
          </Link>{" "}
          {t("playground.noModelConfigured.descriptionPart2")}
        </AlertDescription>
      </Alert>
    </div>
  );
}
