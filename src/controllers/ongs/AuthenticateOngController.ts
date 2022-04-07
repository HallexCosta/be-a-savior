import { Request, Response, IRouter } from 'express'
import { getCustomRepository } from 'typeorm'

import { Logger } from '@common/logger'
import { UsersRepository } from '@repositories/UsersRepository'

import { AuthenticateUserController } from '@controllers/users/AuthenticateUserController'

import { AuthenticateOngService } from '@services/ongs/AuthenticateOngService'

export class AuthenticateOngController 
extends AuthenticateUserController {
  protected readonly group: string = '/ongs'
  protected readonly path: string = '/login'
  protected readonly method: string = 'POST'

  public constructor(
    logger: Logger,
    routes: IRouter
  ) {
    super(logger, routes)
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
      service: new AuthenticateOngService(
        this.authenticateOngServiceDependencies()
      ),
      http: {
        request,
        response
      }
    })
  }

  public authenticateOngServiceDependencies() {
    const usersRepository = getCustomRepository(UsersRepository)

    const depedencies = {
      repositories: {
        users: usersRepository
      }
    }

    return depedencies
  }
}
