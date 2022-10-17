module.exports = {
  'allow-uncaught': false,
  diff: true,
  color: true,
  exit: true,
  bail: false,
  extension: ['ts'],
  package: './package.json',
  reporter: 'spec',
  require: [
    'make-promises-safe',
    'dotenv/config',
    'ts-node/register',
    'tsconfig-paths/register'
  ],
  timeout: 0,
  ui: 'bdd'
}
