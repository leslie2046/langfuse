import { Separator } from "@/src/components/ui/separator";
import { usePlaygroundContext } from "../context";
import { PromptVariableComponent } from "./PromptVariableComponent";
import { useTranslation } from "@/src/features/i18n";

export const Variables = () => {
  const { promptVariables } = usePlaygroundContext();
  const { t } = useTranslation();

  const renderNoVariables = () => (
    <div className="text-xs">
      <p className="mb-2">{t("playground.variables.noVariables")}</p>
      <p>
        {t("playground.variables.instruction")}
        &#123;&#123;exampleVariable&#125;&#125;
      </p>
    </div>
  );

  const renderVariables = () => (
    <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
      {promptVariables
        .slice()
        .sort((a, b) => {
          if (a.isUsed && !b.isUsed) return -1;
          if (!a.isUsed && b.isUsed) return 1;
          return a.name.localeCompare(b.name);
        })
        .map((promptVariable, index) => (
          <div key={promptVariable.name}>
            <PromptVariableComponent promptVariable={promptVariable} />
            {index !== promptVariables.length - 1 && (
              <Separator className="my-2" />
            )}
          </div>
        ))}
    </div>
  );

  return (
    <div className="flex h-full flex-col">
      {promptVariables.length === 0 ? renderNoVariables() : renderVariables()}
    </div>
  );
};
