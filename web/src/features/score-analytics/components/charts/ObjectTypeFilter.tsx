import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { type ObjectType } from "@/src/features/score-analytics/lib/analytics-url-state";
import { useTranslation } from "@/src/features/i18n";

interface ObjectTypeFilterProps {
  value: ObjectType;
  onChange: (value: ObjectType) => void;
  className?: string;
}

export function ObjectTypeFilter({
  value,
  onChange,
  className,
}: ObjectTypeFilterProps) {
  const { t } = useTranslation();

  const options: Array<{ value: ObjectType; label: string }> = [
    { value: "all", label: t("dashboard.scoresAnalytics.objectType.all") },
    { value: "trace", label: t("dashboard.scoresAnalytics.objectType.trace") },
    {
      value: "session",
      label: t("dashboard.scoresAnalytics.objectType.session"),
    },
    {
      value: "observation",
      label: t("dashboard.scoresAnalytics.objectType.observation"),
    },
    {
      value: "dataset_run",
      label: t("dashboard.scoresAnalytics.objectType.dataset_run"),
    },
  ];

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={className} aria-label="Object type">
        <SelectValue
          placeholder={t("dashboard.scoresAnalytics.objectType.prompt")}
        />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
