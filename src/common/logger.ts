import pino from 'pino'
import pretty from 'pino-pretty'

type PrettyLoggerOptions = {
  colorize: boolean
  ignore: string
}

interface ConsoleLogger {
  start(): void
}

class Logger implements ConsoleLogger {
  constructor(
    private readonly options: PrettyLoggerOptions
  ) {
    Object.assign(this, options)
  }

  private prepare(
    options: Partial<PrettyLoggerOptions>
  ) {
    const stream = pretty(options)

    return pino(stream)
  }

  start() {
    return this.prepare(this.options)
  }
}

const logger = new Logger({
  colorize: true,
  ignore: 'pid,hostname'
})

export default logger.start()
