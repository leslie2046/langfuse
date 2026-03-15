/**
 * @jest-environment node
 */

import { readFileSync } from "node:fs";
import path from "node:path";

describe("PromptDetail prompt reference wiring", () => {
  const source = readFileSync(
    path.join(__dirname, "prompt-detail.tsx"),
    "utf8",
  );

  it("uses the shared prompt reference helper and provider", () => {
    expect(source).toMatch(
      /from\s+["']@\/src\/components\/ui\/PromptReferences["']/,
    );
    expect(source).not.toContain("prompt-content-utils");
    expect(source).toContain("<PromptReferenceProvider");
    expect(source).toMatch(/renderRichPromptContent\(\s*prompt\.prompt\s*\)/);
  });
});
