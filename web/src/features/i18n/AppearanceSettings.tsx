import Header from "@/src/components/layouts/header";
import { LanguageSwitcher } from "@/src/features/i18n";
import { useTranslation } from "@/src/features/i18n";

export function AppearanceSettings() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-6">
      <Header title={t("settings.appearance")} />
      <LanguageSwitcher />
    </div>
  );
}
