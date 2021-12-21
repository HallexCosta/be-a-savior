import { Request, Response } from 'express'

import { ListDonationsService } from '@services/donations/ListDonationsService'

export class ListDonationsController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const donorId = request.query.ong_id as string

    const service = new ListDonationsService()

    const incident = await service.execute({
      donorId
    })

    return response.json(incident)
  }
}
