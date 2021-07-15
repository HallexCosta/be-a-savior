module.exports = {
  diff: true,
  color: true,
  exit: true,
  extension: ["ts"],
  package: "./package.json",
  reporter: "landing",
  file: ["__tests__/teardown.ts"],
  require: ["ts-node/register", "tsconfig-paths/register"],
  timeout: 0,
  spec: ["__tests__/unit/**/*.spec.ts"],
  ui: "bdd",
  watchFiles: ["__tests__"],
};
