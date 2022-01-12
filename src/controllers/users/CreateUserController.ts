import { Request, Response } from 'express'

import { CreateUserService } from '@services/users/CreateUserService'
import { CreateOngService } from '@services/users/CreateOngService'
import { CreateDonorService } from '@services/users/CreateDonorService'

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

export abstract class CreateUserController {
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
