const configs = require('./.mocharc.global')

module.exports = {
  ...configs,
  spec: ['__tests__/unit/**/*.spec.ts'],
  exclude: ['__tests__/unit/isolate/*.spec.ts']
}
