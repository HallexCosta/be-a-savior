import { Request, Response } from 'express'

import { CreateOngService } from '@services/ongs/CreateOngService'

export class CreateOngController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const { name, email, password, phone } = request.body

    const service = new CreateOngService()

    const user = await service.execute({
      name,
      email,
      password,
      phone
    })

    return response.status(201).json(user)
  }
}
