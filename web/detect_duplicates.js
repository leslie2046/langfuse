const fs = require("fs");

const detectDuplicates = (filePath) => {
  const content = fs.readFileSync(filePath, "utf8");
  let line = 1;
  const keyStack = []; // Stack to keep track of key paths
  const keys = new Set();

  // Very rough parsing to find duplicate keys, since JSON.parse won't tell us WHERE
  // We'll iterate line by line and use regex to find "key":

  // Actually, let's use a simpler approach.
  // We will read the file line by line and check indentation to guess the object scope.
  // This is fragile but might work for pretty-printed JSON.

  const lines = content.split("\n");
  const scopeStack = [new Set()]; // Stack of sets of keys in current scope

  lines.forEach((l, index) => {
    const trimmed = l.trim();

    // Check for object start
    if (trimmed.endsWith("{")) {
      scopeStack.push(new Set());
    }

    // Check for key
    const match = trimmed.match(/^"([^"]+)":/);
    if (match) {
      const key = match[1];
      const currentScope = scopeStack[scopeStack.length - 1];
      if (currentScope.has(key)) {
        console.log(
          `Duplicate key found: "${key}" at line ${index + 1} in ${filePath}`,
        );
      } else {
        currentScope.add(key);
      }
    }

    // Check for object end
    // Note: this is very brittle if } is not on its own line or combined with , etc.
    // But standard prettier JSON formatting usually puts } on a new line.
    if (trimmed === "}" || trimmed === "},") {
      scopeStack.pop();
    }
  });
};

detectDuplicates("d:/code/github/langfuse/web/src/locales/en.json");
detectDuplicates("d:/code/github/langfuse/web/src/locales/zh.json");
