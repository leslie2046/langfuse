import type { TracingSearchType } from "@langfuse/shared";

export type FullTextSearchType = "content" | "input" | "output";

export function includesSearchType(
  searchType: TracingSearchType[] | undefined,
  type: FullTextSearchType,
): boolean {
  return (searchType as string[] | undefined)?.includes(type) ?? false;
}

// Helper function to get the current search mode value for the radio group
export function getSearchMode(
  searchType: TracingSearchType[] | undefined,
  tableAllowsFullTextSearch = false,
): string {
  if (!searchType || !tableAllowsFullTextSearch) return "metadata";
  if (includesSearchType(searchType, "content")) return "metadata_fulltext";
  if (includesSearchType(searchType, "input")) return "metadata_fulltext_input";
  if (includesSearchType(searchType, "output"))
    return "metadata_fulltext_output";
  return "metadata";
}

// Helper function to get the button label based on current search type
export function getSearchButtonLabel(
  searchType: TracingSearchType[] | undefined,
  metadataLabel?: string,
): string {
  if (!searchType) return metadataLabel ?? "IDs / Names";
  if (includesSearchType(searchType, "content")) return "Full Text: Content";
  if (includesSearchType(searchType, "input")) return "Full Text: Input";
  if (includesSearchType(searchType, "output")) return "Full Text: Output";
  return metadataLabel ?? "IDs / Names";
}

export function hasFullTextSearchType(
  searchType: TracingSearchType[] | undefined,
): boolean {
  return Boolean(
    (searchType as string[] | undefined)?.some(
      (type) => type === "content" || type === "input" || type === "output",
    ),
  );
}

// Helper function to convert search mode value to search type array
export function searchModeToType(mode: string): TracingSearchType[] {
  switch (mode) {
    case "metadata_fulltext":
      return ["id", "content"];
    case "metadata_fulltext_input":
      return ["id", "input"] as TracingSearchType[];
    case "metadata_fulltext_output":
      return ["id", "output"] as TracingSearchType[];
    default:
      return ["id"];
  }
}
