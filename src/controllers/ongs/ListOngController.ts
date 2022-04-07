import { Request, Response, IRouter } from 'express'

import { Logger } from '@common/logger'
import { ListOngService } from '@services/ongs/ListOngService'
import { ListUserController } from '@controllers/users/ListUserController'

import { getCustomRepository } from 'typeorm'
import { UsersRepository } from '@repositories/UsersRepository'

export class ListOngController extends ListUserController {
  protected readonly group: string = '/ongs'  
  protected readonly path: string = '/:id'  
  protected readonly method: string = 'GET'  

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

    const service = new ListOngService(
      this.listOngServiceDependencies()
    )

    return await super.handleUser({
      service,
      http: {
        request,
        response
      }
    })
  }

  public listOngServiceDependencies() {
    const usersRepository = getCustomRepository(UsersRepository)

    const depedencies = {
      repositories: {
        users: usersRepository
      }
    }

    return depedencies
  }
}
