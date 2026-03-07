import { PlusCircle } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { FormDescription, FormLabel } from "@/src/components/ui/form";
import { Accordion } from "@/src/components/ui/accordion";
import { TierAccordionItem } from "./TierAccordionItem";
import { TierPriceEditor } from "./TierPriceEditor";
import { TierPrefillButtons } from "./TierPrefillButtons";
import type { UseFormReturn, UseFieldArrayReturn } from "react-hook-form";
import type { FormUpsertModel } from "../../validation";
import { useTranslation } from "@/src/features/i18n";

type PricingSectionProps = {
  fields: UseFieldArrayReturn<FormUpsertModel, "pricingTiers">["fields"];
  form: UseFormReturn<FormUpsertModel>;
  remove: UseFieldArrayReturn<FormUpsertModel, "pricingTiers">["remove"];
  addTier: () => void;
};

export type { PricingSectionProps };

export function PricingSection({
  fields,
  form,
  remove,
  addTier,
}: PricingSectionProps) {
  const { t } = useTranslation();
  const hasMultipleTiers = fields.length > 1;
  const defaultTierIndex = fields.findIndex((f) => f.isDefault);

  if (!hasMultipleTiers) {
    // SIMPLE VIEW: Just show prices for the single default tier
    return (
      <div className="space-y-4">
        <div>
          <FormLabel>{t("models.upsert.pricing.prices")}</FormLabel>
          <FormDescription>
            {t("models.upsert.pricing.pricesDescription")}
          </FormDescription>
        </div>

        <TierPrefillButtons tierIndex={defaultTierIndex} form={form} />
        <TierPriceEditor
          tierIndex={defaultTierIndex}
          form={form}
          isDefault={true}
        />

        <Button type="button" variant="ghost" onClick={addTier}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {t("models.upsert.pricing.addCustomPricingTier")}
        </Button>
      </div>
    );
  }

  // ACCORDION VIEW: Multiple tiers
  return (
    <div className="space-y-4">
      <div>
        <FormLabel>{t("models.upsert.pricing.tierTitle")}</FormLabel>
        <FormDescription>
          {t("models.upsert.pricing.tierDescription")}
        </FormDescription>
      </div>

      <Accordion
        type="multiple"
        defaultValue={fields.map((_, i) => `tier-${i}`)} // All expanded
        className="space-y-2"
      >
        {fields.map((field, index) => (
          <TierAccordionItem
            key={field.id}
            tier={field}
            index={index}
            form={form}
            remove={remove}
            isDefault={field.isDefault}
          />
        ))}
      </Accordion>

      <Button type="button" variant="outline" onClick={addTier}>
        <PlusCircle className="mr-2 h-4 w-4" />
        {t("models.upsert.pricing.addCustomTier")}
      </Button>
    </div>
  );
}
