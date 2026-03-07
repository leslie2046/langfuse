import React from "react";
import {
  SplashScreen,
  type ValueProposition,
} from "@/src/components/ui/splash-screen";
import { FileText, GitBranch, Zap, BarChart4 } from "lucide-react";
import { useTranslation } from "@/src/features/i18n";

export function PromptsOnboarding({ projectId }: { projectId: string }) {
  const { t } = useTranslation();

  const valuePropositions: ValueProposition[] = [
    {
      title: t("onboarding.prompts.propositions.decoupled.title"),
      description: t("onboarding.prompts.propositions.decoupled.description"),
      icon: <FileText className="h-4 w-4" />,
    },
    {
      title: t("onboarding.prompts.propositions.editInUi.title"),
      description: t("onboarding.prompts.propositions.editInUi.description"),
      icon: <GitBranch className="h-4 w-4" />,
    },
    {
      title: t("onboarding.prompts.propositions.performance.title"),
      description: t("onboarding.prompts.propositions.performance.description"),
      icon: <Zap className="h-4 w-4" />,
    },
    {
      title: t("onboarding.prompts.propositions.compare.title"),
      description: t("onboarding.prompts.propositions.compare.description"),
      icon: <BarChart4 className="h-4 w-4" />,
    },
  ];

  return (
    <SplashScreen
      title={t("onboarding.prompts.title")}
      description={t("onboarding.prompts.description")}
      valuePropositions={valuePropositions}
      primaryAction={{
        label: t("onboarding.prompts.createPrompt"),
        href: `/project/${projectId}/prompts/new`,
      }}
      secondaryAction={{
        label: t("onboarding.prompts.learnMore"),
        href: "https://langfuse.com/docs/prompt-management/get-started",
      }}
    />
  );
}
