module.exports = {
  diff: true,
  color: true,
  exit: true,
  extension: ['ts'],
  package: './package.json',
  reporter: 'spec',
  file: [],
  require: ['dotenv/config', 'ts-node/register', 'tsconfig-paths/register'],
  timeout: 0,
  spec: ['__tests__/unit/**/*.spec.ts', '__tests__/integration/**/*.spec.ts'],
  ui: 'bdd',
  exclude: ['__tests__/unit/isolate/*.spec.ts']
}
