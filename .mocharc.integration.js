const config = require('./.mocharc.global')

module.exports = {
  ...config,
  exit: true,
  file: ['__tests__/setup.ts'],
  spec: ['__tests__/integration/**/*.spec.ts'],
  exclude: ['__tests__/integration/isolate/*.spec.ts']
}
