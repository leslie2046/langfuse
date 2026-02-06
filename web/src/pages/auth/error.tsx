import { ErrorPageWithSentry } from "@/src/components/error-page";
import { useRouter } from "next/router";
import { useTranslation } from "@/src/features/i18n";

export default function AuthError() {
  const router = useRouter();
  const { t } = useTranslation();
  const { error } = router.query;
  const errorMessage = error
    ? decodeURIComponent(String(error))
    : t("errors.authErrorDefault");

  return (
    <ErrorPageWithSentry
      title={t("errors.authenticationError")}
      message={errorMessage}
    />
  );
}
