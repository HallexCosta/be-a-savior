import { Request, Response, IRouter } from 'express'
import { getCustomRepository } from 'typeorm'

import { Logger } from '@common/logger'

import { ListDonorService } from '@services/donors/ListDonorService'

import { ListUserController } from '@controllers/users/ListUserController'

import { UsersRepository } from '@repositories/UsersRepository'

export class ListDonorController 
extends ListUserController {
  protected readonly group: string = '/donors'
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
    request.owner = 'donor'
   
    this.endpointAccessLog(
      this.method,
      this.group.concat('', this.path),
      'guest'
    )

    return await super.handleUser({
      service: new ListDonorService(
        this.listDonorServiceDependencies()
      ),
      http: {
        request,
        response
      }
    })
  }

  public listDonorServiceDependencies() {
    const dependencies = {
      repositories: {
        users: getCustomRepository(UsersRepository)
      }
    }

    return dependencies
  }
}
