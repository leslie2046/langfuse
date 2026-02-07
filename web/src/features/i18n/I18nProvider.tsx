"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  useCallback,
  useMemo,
} from "react";
import { type Locale, defaultLocale, locales } from "@/src/i18n";
import enMessages from "@/src/locales/en.json";
import zhMessages from "@/src/locales/zh.json";

const LOCALE_STORAGE_KEY = "langfuse-locale";

type Messages = typeof enMessages;

const messages: Record<Locale, Messages> = {
  en: enMessages,
  zh: zhMessages,
};

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, variables?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

function interpolate(
  template: string,
  variables: Record<string, string | number>,
): string {
  return template.replace(/{(\w+)}/g, (_, key) => {
    return String(variables[key] ?? `{${key}}`);
  });
}

function getNestedValue(
  obj: Record<string, unknown>,
  path: string,
  variables?: Record<string, string | number>,
): string {
  const keys = path.split(".");
  let current: unknown = obj;

  for (const key of keys) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (current && typeof current === "object" && key in current) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      current = (current as any)[key];
    } else {
      return path; // Return key if not found
    }
  }

  if (typeof current === "string") {
    return variables ? interpolate(current, variables) : current;
  }
  return path;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load saved locale on mount
  useEffect(() => {
    const saved = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (saved && locales.includes(saved as Locale)) {
      setLocaleState(saved as Locale);
    }
    setIsHydrated(true);
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
  }, []);

  const t = useCallback(
    (key: string, variables?: Record<string, string | number>): string => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return getNestedValue(
        messages[locale] as unknown as Record<string, unknown>,
        key,
        variables,
      );
    },
    [locale],
  );

  const value = useMemo(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t],
  );

  // Prevent hydration mismatch by using default locale until mounted
  if (!isHydrated) {
    return (
      <I18nContext.Provider
        value={{
          locale: defaultLocale,
          setLocale,
          t: (key: string, variables?: Record<string, string | number>) =>
            getNestedValue(
              messages[defaultLocale] as unknown as Record<string, unknown>,
              key,
              variables,
            ),
        }}
      >
        {children}
      </I18nContext.Provider>
    );
  }

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextType {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}

// Convenience hook that mirrors common i18n library patterns
export function useTranslation() {
  const { locale, setLocale, t } = useI18n();
  return { t, locale, setLocale };
}
