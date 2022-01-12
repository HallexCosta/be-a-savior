import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'

import { UsersRepository } from '@repositories/UsersRepository'

import { AuthenticateDonorService } from '@services/donors/AuthenticateDonorService'

import { AuthenticateUserController } from '@controllers/users/AuthenticateUserController'

export class AuthenticateDonorController extends AuthenticateUserController {
  public async handle(request: Request, response: Response): Promise<Response> {
    request.owner = 'donor'

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
    const dependencies = {
      repositories: {
        users: getCustomRepository(UsersRepository)
      }
    }
    return dependencies
  }
}
