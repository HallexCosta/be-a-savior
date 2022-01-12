import { Request, Response } from 'express'

import { ListOngService } from '@services/ongs/ListOngService'
import { ListUserController } from '@controllers/users/ListUserController'

import { getCustomRepository } from 'typeorm'
import { UsersRepository } from '@repositories/UsersRepository'

export class ListOngController extends ListUserController {
  public constructor() {
    super()
  }

  public async handle(request: Request, response: Response): Promise<Response> {
    request.owner = 'ong'

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
