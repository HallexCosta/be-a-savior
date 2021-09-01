import { Request, Response } from 'express'

import { ListDonationsService } from '@services/donations/ListDonationsService'

export class ListDonationsController {
  public async handle(_: Request, response: Response): Promise<Response> {
    const service = new ListDonationsService()

    const incident = await service.execute()

    return response.json(incident)
  }
}
