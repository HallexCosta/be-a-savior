import { Request, Response } from 'express'

import { AuthenticateDonorService } from '@services/donors/AuthenticateDonorService'

export class AuthenticateDonorController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body

    const service = new AuthenticateDonorService()

    const token = await service.execute({
      email,
      password
    })

    return response.json({
      token
    })
  }
}
