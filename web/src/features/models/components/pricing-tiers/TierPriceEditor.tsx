import { MinusCircle, PlusCircle } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { FormLabel } from "@/src/components/ui/form";
import { PricePreview } from "../PricePreview";
import type { UseFormReturn } from "react-hook-form";
import type { FormUpsertModel } from "../../validation";
import { useTranslation } from "@/src/features/i18n";

type TierPriceEditorProps = {
  tierIndex: number;
  form: UseFormReturn<FormUpsertModel>;
  isDefault: boolean;
};

export type { TierPriceEditorProps };

export function TierPriceEditor({
  tierIndex,
  form,
  isDefault,
}: TierPriceEditorProps) {
  const { t } = useTranslation();
  const prices = form.watch(`pricingTiers.${tierIndex}.prices`) || {};

  return (
    <div className="space-y-3">
      <FormLabel>{t("models.upsert.pricing.prices")}</FormLabel>
      <div className="grid grid-cols-2 gap-1 text-sm text-muted-foreground">
        <span>{t("models.upsert.pricing.usageType")}</span>
        <span>{t("models.upsert.pricing.price")}</span>
      </div>
      {Object.entries(prices).map(([key, value], priceIndex) => (
        <div key={priceIndex} className="grid grid-cols-2 gap-1">
          <Input
            placeholder={t("models.upsert.pricing.keyPlaceholder")}
            value={key}
            disabled={!isDefault}
            onChange={(e) => {
              const newPrices = { ...prices };
              const oldValue = newPrices[key];
              delete newPrices[key];
              newPrices[e.target.value] = oldValue;
              form.setValue(`pricingTiers.${tierIndex}.prices`, newPrices);
            }}
            className={!isDefault ? "cursor-not-allowed bg-muted" : ""}
          />
          <div className="flex gap-1">
            <Input
              type="number"
              placeholder={t("models.upsert.pricing.pricePlaceholder")}
              value={value as number}
              step="0.000001"
              onChange={(e) => {
                form.setValue(`pricingTiers.${tierIndex}.prices`, {
                  ...prices,
                  [key]: parseFloat(e.target.value),
                });
              }}
            />
            {isDefault && (
              <Button
                type="button"
                variant="outline"
                title={t("models.upsert.pricing.removePrice")}
                size="icon"
                onClick={() => {
                  const newPrices = { ...prices };
                  delete newPrices[key];
                  form.setValue(`pricingTiers.${tierIndex}.prices`, newPrices);
                }}
              >
                <MinusCircle className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      ))}
      {isDefault && (
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            // Generate unique key name
            let counter = 1;
            let newKey = "new_usage_type";
            while (prices[newKey] !== undefined) {
              newKey = `new_usage_type_${counter}`;
              counter++;
            }
            form.setValue(`pricingTiers.${tierIndex}.prices`, {
              ...prices,
              [newKey]: 0.000001,
            });
          }}
          className="flex items-center gap-1"
        >
          <PlusCircle className="h-4 w-4" />
          <span>{t("models.upsert.pricing.addPrice")}</span>
        </Button>
      )}
      <PricePreview prices={prices} />
    </div>
  );
}
