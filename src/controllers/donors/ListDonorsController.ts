import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'

import { ListUsersController } from '@controllers/users/ListUsersController'
import { ListDonorsService } from '@services/donors/ListDonorsService'
import { UsersRepository } from '@repositories/UsersRepository'

export class ListDonorsController extends ListUsersController {
  public async handle(request: Request, response: Response): Promise<Response> {
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
