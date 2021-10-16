const config = require('./.mocharc.global')

module.exports = {
  ...config,
  spec: ['__tests__/integration/**/*.spec.ts'],
  exclude: ['__tests__/integration/isolate/*.spec.ts']
}
