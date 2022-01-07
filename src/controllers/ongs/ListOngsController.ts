import { getCustomRepository } from 'typeorm'
import { Request, Response } from 'express'

import { UsersRepository } from '@repositories/UsersRepository'

import { ListUsersController } from '@controllers/users/ListUsersController'

import { ListOngsService } from '@services/ongs/ListOngsService'


export class ListOngsController extends ListUsersController {
  public async handle(request: Request, response: Response): Promise<Response> {
    request.owner = 'ong'

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
    const dependencies = {
      repositories: {
        users: getCustomRepository(UsersRepository)
      }
    }

    return dependencies
  }
}
