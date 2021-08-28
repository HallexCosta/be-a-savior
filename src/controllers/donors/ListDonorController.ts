import { Request, Response } from 'express'

import { ListDonorService } from '@services/donors/ListDonorService'

export class ListDonorController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params

    const service = new ListDonorService()

    const donor = await service.execute({ id })

    return response.json(donor)
  }
}
