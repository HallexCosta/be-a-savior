import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'

import { UsersRepository } from '@repositories/UsersRepository'

import { AuthenticateUserController } from '@controllers/users/AuthenticateUserController'

import { AuthenticateOngService } from '@services/ongs/AuthenticateOngService'

export class AuthenticateOngController extends AuthenticateUserController {
  public async handle(request: Request, response: Response): Promise<Response> {
    request.owner = 'ong'

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
