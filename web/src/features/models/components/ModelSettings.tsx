import Header from "@/src/components/layouts/header";
import ModelTable from "@/src/components/table/use-cases/models";
import { useTranslation } from "@/src/features/i18n";

export function ModelsSettings(props: { projectId: string }) {
  const { t } = useTranslation();
  return (
    <>
      <Header title={t("models.title")} />
      <p className="mb-2 text-sm">{t("models.description")}</p>
      <ModelTable projectId={props.projectId} />
    </>
  );
}
