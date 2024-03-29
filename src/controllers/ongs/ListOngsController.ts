import { getCustomRepository } from 'typeorm'
import { Request, Response, IRouter } from 'express'

import { Logger } from '@common/logger'
import { UsersRepository } from '@repositories/UsersRepository'

import { ListUsersController } from '@controllers/users/ListUsersController'

import { ListOngsService } from '@services/ongs/ListOngsService'
import { ConnectionPlugin } from '@database/ConnectionAdapter'

export class ListOngsController extends ListUsersController {
  protected readonly group: string = '/ongs'
  protected readonly path: string = '/'
  protected readonly method: string = 'GET'

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
    request.owner = 'ong'

    this.endpointAccessLog(
      this.method,
      this.group.concat('', this.path),
      'guest'
    )

    return await super.handleUser({
      service: new ListOngsService(
        this.listOngsServiceDependencies()
      ),
      http: {
        request,
        response
      }
    })
  }

  public listOngsServiceDependencies() {
    const connection = this.connectionPlugin.connect()
    const dependencies = {
      repositories: {
        users: connection.getCustomRepository(UsersRepository)
      }
    }

    return dependencies
  }
}
