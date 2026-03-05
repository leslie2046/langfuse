import { Switch } from "@/src/components/ui/switch";
import { Label } from "@/src/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";
import { useV4Beta } from "@/src/features/events/hooks/useV4Beta";
import { usePostHogClientCapture } from "@/src/features/posthog-analytics/usePostHogClientCapture";
import { cn } from "@/src/utils/tailwind";
import { useTranslation } from "@/src/features/i18n";

export function V4BetaSidebarToggle() {
  const { t } = useTranslation();
  const { isBetaEnabled, setBetaEnabled, isLoading } = useV4Beta();
  const capture = usePostHogClientCapture();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={cn(
            "flex h-8 w-full items-center gap-2 overflow-hidden p-2 text-left text-sm",
            "group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0",
          )}
        >
          <Switch
            id="v4-beta-toggle"
            size="sm"
            checked={isBetaEnabled}
            onCheckedChange={(enabled) => {
              setBetaEnabled(enabled);
              capture("sidebar:v4_beta_toggled", { enabled });
            }}
            disabled={isLoading}
            className="shrink-0"
          />
          <Label
            htmlFor="v4-beta-toggle"
            className="cursor-pointer text-sm font-normal group-data-[collapsible=icon]:hidden"
          >
            {t("navigation.v4Beta")}
          </Label>
        </div>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs text-xs">
        {t("navigation.v4BetaTooltip")}
      </TooltipContent>
    </Tooltip>
  );
}
