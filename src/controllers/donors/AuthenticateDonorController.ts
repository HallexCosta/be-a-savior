import { IRouter, Request, Response } from 'express'

import { Logger } from '@common/logger'
import { UsersRepository } from '@repositories/UsersRepository'

import { AuthenticateDonorService } from '@services/donors/AuthenticateDonorService'

import { AuthenticateUserController } from '@controllers/users/AuthenticateUserController'
import { ConnectionPlugin } from '@database/ConnectionAdapter'

export class AuthenticateDonorController extends AuthenticateUserController {
   protected readonly group: string = '/donors'
   protected readonly path: string = '/login'
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
      service: new AuthenticateDonorService(
        this.authenticateDonorServiceDependencies()
      ),
      http: {
        request,
        response
      }
    })
  }

  public authenticateDonorServiceDependencies() {
    const connection = this.connectionPlugin.connect()
    const dependencies = {
      repositories: {
        users: connection.getCustomRepository(UsersRepository)
      }
    }
    return dependencies
  }
}
