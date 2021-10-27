module.exports = {
  'allow-uncaught': false,
  diff: true,
  color: true,
  exit: true,
  bail: true,
  extension: ['ts'],
  package: './package.json',
  reporter: 'spec',
  require: ['make-promisess-safe', 'dotenv/config', 'ts-node/register', 'tsconfig-paths/register'],
  timeout: 0,
  ui: 'bdd',
}
