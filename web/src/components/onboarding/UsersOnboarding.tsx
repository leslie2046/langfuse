import React from "react";
import { SplashScreen } from "@/src/components/ui/splash-screen";
import { ActionButton } from "@/src/components/ActionButton";
import { useTranslation } from "@/src/features/i18n";

export function UsersOnboarding() {
  const { t } = useTranslation();

  return (
    <SplashScreen
      title={t("onboarding.users.title")}
      description={t("onboarding.users.description")}
      videoSrc="https://static.langfuse.com/prod-assets/onboarding/users-overview-v1.mp4"
    >
      <div className="mt-8">
        <h3 className="mb-4 text-2xl font-semibold">
          {t("onboarding.users.startTracking")}
        </h3>
        <p className="mb-4 text-sm text-muted-foreground">
          {t("onboarding.users.guide")}
        </p>
        <ActionButton
          href="https://langfuse.com/docs/observability/features/users"
          variant="default"
        >
          {t("onboarding.users.readDocs")}
        </ActionButton>
      </div>
    </SplashScreen>
  );
}
