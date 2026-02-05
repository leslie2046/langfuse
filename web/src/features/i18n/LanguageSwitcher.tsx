"use client";

import { useTranslation } from "@/src/features/i18n";
import { type Locale, locales, localeNames } from "@/src/i18n";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Label } from "@/src/components/ui/label";

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useTranslation();

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="language-select">{t("settings.language")}</Label>
      <p className="text-sm text-muted-foreground">
        {t("settings.languageDescription")}
      </p>
      <Select
        value={locale}
        onValueChange={(value) => setLocale(value as Locale)}
      >
        <SelectTrigger id="language-select" className="w-[180px]">
          <SelectValue placeholder={t("settings.language")} />
        </SelectTrigger>
        <SelectContent>
          {locales.map((loc) => (
            <SelectItem key={loc} value={loc}>
              {localeNames[loc]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
