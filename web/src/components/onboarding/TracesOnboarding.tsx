import React from "react";
import { SplashScreen } from "@/src/components/ui/splash-screen";
import { TracingSetup } from "@/src/pages/project/[projectId]/traces/setup";
import { useTranslation } from "@/src/features/i18n";

interface TracesOnboardingProps {
  projectId: string;
}

export function TracesOnboarding({ projectId }: TracesOnboardingProps) {
  const { t } = useTranslation();

  return (
    <SplashScreen
      title={t("onboarding.traces.title")}
      description={t("onboarding.traces.description")}
      videoSrc="https://static.langfuse.com/prod-assets/onboarding/tracing-overview-v1.mp4"
    >
      <div className="mt-8">
        <h3 className="mb-8 text-2xl font-semibold">
          {t("onboarding.getStarted")}
        </h3>
        <TracingSetup projectId={projectId} hasTracingConfigured={false} />
      </div>
    </SplashScreen>
  );
}
