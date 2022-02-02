import { Request, Response } from 'express'

import { CreateOngService } from '@services/ongs/CreateOngService'
import { CreateDonorService } from '@services/donors/CreateDonorService'

type CreateUserHandleParams = {
  service: CreateOngService | CreateDonorService
  http: {
    request: Request,
    response: Response
  }
}

type CreateUserResponse = Response

interface UserController {
  handleUser(userHandle: CreateUserHandleParams): Promise<CreateUserResponse>
}

export abstract class CreateUserController implements UserController {
  public async handleUser({ service, http: { request, response } }: CreateUserHandleParams): Promise<Response> {
    const { name, email, password, phone } = request.body
    const { owner } = request

    const user = await service.execute({
      name,
      email,
      password,
      phone,
      owner
    })

    return response.status(201).json(user)
  }
}
