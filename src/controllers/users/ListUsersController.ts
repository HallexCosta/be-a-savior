import { Request, Response } from 'express'

import { ListOngsService } from '@services/ongs/ListOngsService'
import { ListDonorsService } from '@services/donors/ListDonorsService'


type ListUsersHandleParams = {
  service: ListDonorsService | ListOngsService,
  http: {
    request: Request
    response: Response
  }
}

interface UsersController {
  handleUser(usersHandle: ListUsersHandleParams): Promise<Response>
}

export class ListUsersController implements UsersController {
  public async handleUser({
    service,
    http: {
      request,
      response
    }
  }: ListUsersHandleParams): Promise<Response> {
    const { owner } = request

    const users = await service.execute({
      owner
    })

    return response.json(users)
  }
}
