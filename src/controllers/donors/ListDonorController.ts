import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'

import { ListDonorService } from '@services/donors/ListDonorService'

import { ListUserController } from '@controllers/users/ListUserController'

import { UsersRepository } from '@repositories/UsersRepository'

export class ListDonorController extends ListUserController {
  public async handle(request: Request, response: Response): Promise<Response> {
    request.owner = 'donor'

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
