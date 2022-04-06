import pino from 'pino'
import pretty from 'pino-pretty'

export interface Logger {
  info(message: string): void
  error(message: string): void
  warn(messagE: string): void
}

type PrettyLoggerOptions = {
  colorize: boolean
  ignore: string
}

interface LoggerBuild {
  start(): void
}

class ConsoleLogger implements LoggerBuild {
  constructor(
    private readonly options: PrettyLoggerOptions
  ) {}

  private prepare(
    options: Partial<PrettyLoggerOptions>
  )  {
    const stream = pretty(options)

    return pino(stream)
  }

  start() {
    return this.prepare(this.options)
  }
}

const logger = new ConsoleLogger({
  colorize: true,
  ignore: 'pid,hostname'
})

export default logger.start()
