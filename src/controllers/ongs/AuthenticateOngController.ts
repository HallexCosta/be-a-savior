import { Request, Response } from 'express'

import { AuthenticateOngService } from '@services/ongs/AuthenticateOngService'

export class AuthenticateOngController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body

    const service = new AuthenticateOngService()

    const token = await service.execute({
      email,
      password
    })

    return response.json({
      token
    })
  }
}
