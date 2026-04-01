const { pathToFileURL } = require("node:url");

/** @type {import("prettier").Config} */
const config = {
  plugins: [pathToFileURL(require.resolve("prettier-plugin-tailwindcss")).href],
};

module.exports = config;
