import { IRouter, Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'

import { Logger } from '@common/logger'
import { ListUsersController } from '@controllers/users/ListUsersController'
import { ListDonorsService } from '@services/donors/ListDonorsService'
import { UsersRepository } from '@repositories/UsersRepository'

export class ListDonorsController extends ListUsersController {
  protected readonly group: string = 'donors'
  protected readonly path: string = '/'
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
      service: new ListDonorsService(
        this.listDonorsServiceDependencies()
      ),
      http: {
        request,
        response
      }
    })
  }

  public listDonorsServiceDependencies() {
    const dependencies = {
      repositories: {
        users: getCustomRepository(UsersRepository)
      }
    }

    return dependencies
  }
}
