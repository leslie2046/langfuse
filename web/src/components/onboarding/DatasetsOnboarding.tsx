import React from "react";
import {
  SplashScreen,
  type ValueProposition,
} from "@/src/components/ui/splash-screen";
import { Database, Beaker, Zap, Code } from "lucide-react";
import { DatasetActionButton } from "@/src/features/datasets/components/DatasetActionButton";
import { useTranslation } from "@/src/features/i18n";

export function DatasetsOnboarding({ projectId }: { projectId: string }) {
  const { t } = useTranslation();

  const valuePropositions: ValueProposition[] = [
    {
      title: t("onboarding.datasets.propositions.continuous.title"),
      description: t("onboarding.datasets.propositions.continuous.description"),
      icon: <Zap className="h-4 w-4" />,
    },
    {
      title: t("onboarding.datasets.propositions.preDeployment.title"),
      description: t(
        "onboarding.datasets.propositions.preDeployment.description",
      ),
      icon: <Beaker className="h-4 w-4" />,
    },
    {
      title: t("onboarding.datasets.propositions.structured.title"),
      description: t("onboarding.datasets.propositions.structured.description"),
      icon: <Database className="h-4 w-4" />,
    },
    {
      title: t("onboarding.datasets.propositions.custom.title"),
      description: t("onboarding.datasets.propositions.custom.description"),
      icon: <Code className="h-4 w-4" />,
    },
  ];

  return (
    <SplashScreen
      title={t("onboarding.datasets.title")}
      description={t("onboarding.datasets.description")}
      valuePropositions={valuePropositions}
      primaryAction={{
        label: t("onboarding.datasets.createDataset"),
        component: (
          <DatasetActionButton
            variant="default"
            mode="create"
            projectId={projectId}
            size="lg"
          />
        ),
      }}
      secondaryAction={{
        label: t("onboarding.datasets.learnMore"),
        href: "https://langfuse.com/docs/datasets",
      }}
      videoSrc="https://static.langfuse.com/prod-assets/onboarding/datasets-overview-v1.mp4"
    />
  );
}
