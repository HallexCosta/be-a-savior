import { Request, Response } from 'express'
import { Logger } from '@common/logger'

export type EndpointHandler = (request: Request, response: Response) => Promise<Response> | Response

type SubscribeEndpointParams = {
  method: string
  group?: string
  path: string
  handler: EndpointHandler
}

interface Controller {
  subscribe(subscribeEndpointParams: SubscribeEndpointParams): void
  setMiddlewares(middlewares: Function[]): Controller
  endpointAccessLog(method: string, path: string, userId: string): void
}

export interface Router {
  post(path: string, handler: (request: Request, response: Response) => Response): Router
  delete(path: string, handler: (request: Request, response: Response) => Response): Router
  get(path: string, handler: (request: Request, response: Response) => Response): Router
  put(path: string, handler: (request: Request, response: Response) => Response): Router
  patch(path: string, handler: (request: Request, response: Response) => Response): Router
}

export default abstract class BaseController implements Controller {
  private readonly middlewares: Function[] = []

  public constructor(
    protected readonly logger: Logger,
    protected readonly routes: Router
  ) {}

  subscribe({
    method,
    path,
    group,
    handler
  }: SubscribeEndpointParams) {
    group ??= ''
    this.logger.info(`> Creating Endpoint: ${method.toUpperCase()} "${group.concat('', path.toLowerCase())}"`)
    const register = this.routes[method.toLowerCase()]
    register.call(
      this.routes,
      path,
      ...this.middlewares,
      handler
    )
  }

  public setMiddlewares(middlewares: Function[]) {
    this.middlewares.push(...middlewares)
    return this
  }

  public endpointAccessLog(method: string, path: string, userId: string) {
    const date = new Intl.DateTimeFormat('pt-br', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      fractionalSecondDigits: 3,
      hour12: true,
      timeZone: 'UTC'
    }).format(Date.now())

    this.logger
      .info(`> ${method.toUpperCase()} "${path.toLowerCase()}" accessed by user ${userId} in ${date}`)
  }

  abstract handle(request: Request, response: Response): Promise<Response> 
}
