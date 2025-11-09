module.exports = {
  input: ["app/**/*.{js,jsx,ts,tsx}", "components/**/*.{js,jsx,ts,tsx}"], // Source files
  output: "public/locales/$LOCALE/$NAMESPACE.json", // Where to save extracted files
  locales: ["en"], // List of supported languages
  defaultNamespace: "common",
  keySeparator: false, // If false, supports nested keys like "menu.file"
  namespaceSeparator: false,
  useKeysAsDefaultValue: true, // Uses the key itself as the default text
  createOldCatalogs: false, // Don't keep old translations
};
