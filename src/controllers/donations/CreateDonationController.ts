import { Request, Response } from 'express'

import { CreateDonationService } from '@services/donations/CreateDonationService'

export class CreateDonationController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const { incident_id: incidentId, donor_id: donorId, amount } = request.body

    const service = new CreateDonationService()

    const donate = await service.execute({
      incidentId,
      donorId,
      amount
    })

    return response.status(201).json(donate)
  }
}
