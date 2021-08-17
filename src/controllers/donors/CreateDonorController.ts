import { Request, Response } from 'express'

import { CreateDonorService } from '@services/donors/CreateDonorService'

export class CreateDonorController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const { name, email, password, phone } = request.body

    const service = new CreateDonorService()

    const donor = await service.execute({
      name,
      email,
      password,
      phone
    })

    return response.status(201).json(donor)
  }
}
