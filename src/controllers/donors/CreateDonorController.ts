import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'

import { CreateDonorService } from '@services/donors/CreateDonorService'

import { CreateUserController } from '@controllers/users/CreateUserController'

import { UsersRepository } from '@repositories/UsersRepository'

type CreateDonorRepositories = {
  users: UsersRepository
}

type Dependencies = {
  repositories: CreateDonorRepositories
}

export class CreateDonorController extends CreateUserController {
  public async handle(request: Request, response: Response): Promise<Response> {
    request.owner = 'donor'

    return await super.handleUser({
      service: new CreateDonorService(),
      http: {
        request,
        response
      }
    })
  }

  public createDonorServiceDependencies() {
    const dependencies = {
      repositories: {
        users: getCustomRepository(UsersRepository)
      }
    }

    return dependencies
  }
}
