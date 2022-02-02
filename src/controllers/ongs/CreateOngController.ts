import { getCustomRepository } from 'typeorm'
import { Request, Response } from 'express'

import { CreateUserController } from '@controllers/users/CreateUserController'

import {
  CreateOngDependencies,
  CreateOngService
} from '@services/ongs/CreateOngService'

import { StripeProvider } from '@providers/StripeProvider'
import { UsersRepository } from '@repositories/UsersRepository'

export class CreateOngController extends CreateUserController {
  public async handle(request: Request, response: Response): Promise<Response> {
    request.owner = 'ong'

    return await super.handleUser({
      service: new CreateOngService(
        this.createOngServiceDependencies()
      ),
      http: {
        request,
        response
      }
    })
  }

  public createOngServiceDependencies(): CreateOngDependencies {
    return {
      repositories: {
        users: getCustomRepository(UsersRepository)
      },
      providers: {
        stripe: new StripeProvider()
      }
    }
  }
}
