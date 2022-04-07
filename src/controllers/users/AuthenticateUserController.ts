import { Request, Response } from 'express'

import { AuthenticateOngService } from '@services/ongs/AuthenticateOngService'
import { AuthenticateDonorService } from '@services/donors/AuthenticateDonorService'
import BaseController from '@controllers/BaseController'

type AuthenticateUserHandleParams = {
  service: AuthenticateOngService | AuthenticateDonorService
  http: {
    request: Request,
    response: Response
  }
}

interface UserController {
  handleUser(userHandle: AuthenticateUserHandleParams): Promise<Response>
}

export abstract class AuthenticateUserController extends BaseController implements UserController {
  public async handleUser({
    service,
    http: {
      request,
      response
    }
  }: AuthenticateUserHandleParams): Promise<Response> {
    const { email, password } = request.body
    const { owner } = request

    const token = await service.execute({
      email,
      password,
      owner
    })

    return response.json({
      token
    })
  }
}
