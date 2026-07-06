describe("in-app agent skills", () => {
  it("loads generated skill markdown regardless of line endings", async () => {
    const { LANGFUSE_IN_APP_AGENT_SKILLS } = await import(
      "@/src/ee/features/in-app-agent/server/skills"
    );

    expect(LANGFUSE_IN_APP_AGENT_SKILLS.length).toBeGreaterThan(0);
  });
});
