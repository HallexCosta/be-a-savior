const mode = process.env.NODE_ENV

const modes = {
  production: false,
  development: false,
  test: false
}

modes[mode] = true

export default modes
