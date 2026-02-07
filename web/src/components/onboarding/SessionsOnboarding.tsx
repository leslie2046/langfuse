import React from "react";
import { SplashScreen } from "@/src/components/ui/splash-screen";
import { ActionButton } from "@/src/components/ActionButton";
import { useTranslation } from "@/src/features/i18n";

export function SessionsOnboarding() {
  const { t } = useTranslation();

  return (
    <SplashScreen
      title={t("onboarding.sessions.title")}
      description={t("onboarding.sessions.description")}
      videoSrc="https://static.langfuse.com/prod-assets/onboarding/sessions-overview-v1.mp4"
    >
      <div className="mt-8">
        <h3 className="mb-4 text-2xl font-semibold">
          {t("onboarding.sessions.startUsing")}
        </h3>
        <p className="mb-4 text-sm text-muted-foreground">
          {t("onboarding.sessions.guide")}
        </p>
        <ActionButton
          href="https://langfuse.com/docs/observability/features/sessions"
          variant="default"
        >
          {t("onboarding.sessions.readDocs")}
        </ActionButton>
      </div>
    </SplashScreen>
  );
}
