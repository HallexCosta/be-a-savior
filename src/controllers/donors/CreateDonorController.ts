import { Request, Response, IRouter } from 'express'

import { Logger } from '@common/logger'
import { ConnectionPlugin } from '@database/ConnectionAdapter'
import { CreateDonorService } from '@services/donors/CreateDonorService'

import { CreateUserController } from '@controllers/users/CreateUserController'

import { UsersRepository } from '@repositories/UsersRepository'

export class CreateDonorController extends CreateUserController {
  protected readonly group: string = '/donors'
  protected readonly path: string = '/'
  protected readonly method: string = 'POST'

  public constructor(
    logger: Logger,
    routes: IRouter,
    connectionAdapter: ConnectionPlugin
  ) {
    super(logger, routes, connectionAdapter)
    this.subscribe({
      group: this.group,
      path: this.path,
      method: this.method,
      handler: this.handle.bind(this)
    })
  }

  public async handle(request: Request, response: Response): Promise<Response> {
    request.owner = 'donor'

    this.endpointAccessLog(
      this.method,
      this.group.concat('', this.path),
      'guest'
    )

    return await super.handleUser({
      service: new CreateDonorService(
        this.createDonorServiceDependencies()
      ),
      http: {
        request,
        response
      }
    })
  }

  public createDonorServiceDependencies() {
    const connection = this.connectionPlugin.connect()
    const dependencies = {
      repositories: {
        users: connection.getCustomRepository(UsersRepository)
      }
    }

    return dependencies
  }
}
