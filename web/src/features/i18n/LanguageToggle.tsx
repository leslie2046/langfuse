import React from "react";
import { useTranslation } from "@/src/features/i18n";
import { cn } from "@/src/utils/tailwind";

export function LanguageToggle() {
  const { locale, setLocale } = useTranslation();

  return (
    <div className="flex items-center space-x-1">
      <span className="mr-2 text-sm">Language</span>
      <div 
        title="English"
        className={cn(
          locale === "en" ? "bg-accent text-accent-foreground" : "text-muted-foreground",
          "cursor-pointer rounded-sm px-2 py-1 text-xs hover:bg-accent hover:text-accent-foreground"
        )}
        onClick={(e) => {
          e.preventDefault();
          setLocale("en");
        }}
      >
        EN
      </div>
      <div 
        title="中文"
        className={cn(
          locale === "zh" ? "bg-accent text-accent-foreground" : "text-muted-foreground",
          "cursor-pointer rounded-sm px-2 py-1 text-xs hover:bg-accent hover:text-accent-foreground"
        )}
        onClick={(e) => {
          e.preventDefault();
          setLocale("zh");
        }}
      >
        中
      </div>
    </div>
  );
}
