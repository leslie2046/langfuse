import React from "react";
import {
  SplashScreen,
  type ValueProposition,
} from "@/src/components/ui/splash-screen";
import { ThumbsUp, Star, LineChart, Code } from "lucide-react";
import { useTranslation } from "@/src/features/i18n";

export function ScoresOnboarding() {
  const { t } = useTranslation();

  const valuePropositions: ValueProposition[] = [
    {
      title: t("onboarding.scores.propositions.collect.title"),
      description: t("onboarding.scores.propositions.collect.description"),
      icon: <ThumbsUp className="h-4 w-4" />,
    },
    {
      title: t("onboarding.scores.propositions.modelBased.title"),
      description: t("onboarding.scores.propositions.modelBased.description"),
      icon: <Star className="h-4 w-4" />,
    },
    {
      title: t("onboarding.scores.propositions.track.title"),
      description: t("onboarding.scores.propositions.track.description"),
      icon: <LineChart className="h-4 w-4" />,
    },
    {
      title: t("onboarding.scores.propositions.custom.title"),
      description: t("onboarding.scores.propositions.custom.description"),
      icon: <Code className="h-4 w-4" />,
    },
  ];

  return (
    <SplashScreen
      title={t("onboarding.scores.title")}
      description={t("onboarding.scores.description")}
      valuePropositions={valuePropositions}
      secondaryAction={{
        label: t("onboarding.scores.learnMore"),
        href: "https://langfuse.com/docs/evaluation/evaluation-methods/custom-scores",
      }}
      videoSrc="https://static.langfuse.com/prod-assets/onboarding/scores-overview-v1.mp4"
    />
  );
}
