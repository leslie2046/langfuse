import React from "react";
import {
  SplashScreen,
  type ValueProposition,
} from "@/src/components/ui/splash-screen";
import { Bot, Gauge, Zap, BarChart4, Code2 } from "lucide-react";
import { useTranslation } from "@/src/features/i18n";
import { useIsCodeEvalEnabled } from "@/src/features/evals/hooks/useIsCodeEvalEnabled";

interface EvaluatorsOnboardingProps {
  projectId: string;
}

export function EvaluatorsOnboarding({ projectId }: EvaluatorsOnboardingProps) {
  const { t } = useTranslation();
  const { enabled, supportedSourceCodeLanguages } = useIsCodeEvalEnabled();
  const supportsPythonCodeEvaluators = supportedSourceCodeLanguages.some(
    (language) => String(language) === "PYTHON",
  );
  const codeEvaluatorLanguageDescription = supportsPythonCodeEvaluators
    ? "TypeScript or Python"
    : "TypeScript";

  const llmAsJudgeValuePropositions: ValueProposition[] = [
    {
      title: t("onboarding.evaluators.propositions.automate.title"),
      description: t("onboarding.evaluators.propositions.automate.description"),
      icon: <Bot className="h-4 w-4" />,
    },
    {
      title: t("onboarding.evaluators.propositions.measure.title"),
      description: t("onboarding.evaluators.propositions.measure.description"),
      icon: <Gauge className="h-4 w-4" />,
    },
    {
      title: t("onboarding.evaluators.propositions.scale.title"),
      description: t("onboarding.evaluators.propositions.scale.description"),
      icon: <Zap className="h-4 w-4" />,
    },
    {
      title: t("onboarding.evaluators.propositions.track.title"),
      description: t("onboarding.evaluators.propositions.track.description"),
      icon: <BarChart4 className="h-4 w-4" />,
    },
  ];

  if (enabled) {
    const evaluatorTypes: ValueProposition[] = [
      {
        title: "LLM-as-a-judge evaluators",
        description:
          "Use an LLM to score outputs against natural-language criteria.",
        icon: <Bot className="h-4 w-4" />,
      },
      {
        title: "Code evaluators",
        description: `Write ${codeEvaluatorLanguageDescription} logic for deterministic, custom scoring.`,
        icon: <Code2 className="h-4 w-4" />,
      },
    ];

    return (
      <SplashScreen
        title="Get started with evaluations"
        description="Use evaluators to score traces and observations automatically. Langfuse supports two evaluator types:"
        valuePropositions={evaluatorTypes}
        primaryAction={{
          label: "Create Evaluator",
          href: `/project/${projectId}/evals/new`,
        }}
        secondaryAction={{
          label: "Learn More",
          href: "https://langfuse.com/docs/evaluation",
        }}
      />
    );
  }

  return (
    <SplashScreen
      title={t("onboarding.evaluators.title")}
      description={t("onboarding.evaluators.description")}
      valuePropositions={llmAsJudgeValuePropositions}
      primaryAction={{
        label: t("onboarding.evaluators.createEvaluator"),
        href: `/project/${projectId}/evals/new`,
      }}
      secondaryAction={{
        label: t("onboarding.evaluators.learnMore"),
        href: "https://langfuse.com/docs/evaluation/evaluation-methods/llm-as-a-judge",
      }}
      videoSrc="https://static.langfuse.com/prod-assets/onboarding/scores-llm-as-a-judge-overview-v1.mp4"
    />
  );
}
