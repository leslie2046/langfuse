/**
 * Loading layout variant
 * Shown during session loading and authentication redirects
 */

import { Spinner } from "@/src/components/layouts/spinner";
import { useTranslation } from "@/src/features/i18n";

type LoadingLayoutProps = {
  message?: string;
};

export function LoadingLayout({ message }: LoadingLayoutProps) {
  const { t } = useTranslation();

  // Translate message if it matches known keys, otherwise use as-is
  const getTranslatedMessage = () => {
    if (!message) return t("common.loading");
    if (message === "Loading") return t("common.loading");
    if (message === "Redirecting") return t("common.redirecting");
    return message;
  };

  return <Spinner message={getTranslatedMessage()} />;
}
