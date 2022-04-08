import { Request, Response } from 'express'

import BaseController from '@controllers/BaseController'
import { ListOngService } from '@services/ongs/ListOngService'
import { ListDonorService } from '@services/donors/ListDonorService'

type ListUserHandleParams = {
  service: ListOngService | ListDonorService,
  http: {
    request: Request
    response: Response
  }
}

interface UserController {
  handleUser(userHandle: ListUserHandleParams): Promise<Response>
}

export abstract class ListUserController
extends BaseController implements UserController {
  public async handleUser({ service, http: { request, response } }: ListUserHandleParams): Promise<Response> {
    const { id } = request.params
    const { owner } = request

    const user = await service.execute({
      id,
      owner
    })

    return response.json(user)
  }
}
