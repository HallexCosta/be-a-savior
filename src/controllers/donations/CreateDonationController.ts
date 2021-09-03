import { Request, Response } from 'express'

import { StripeProvider } from '@providers/StripeProvider'

import {
  CreateDonationDependencies,
  CreateDonationService
} from '@services/donations/CreateDonationService'

export class CreateDonationController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const { donor_id: donorId } = request

    const { incident_id: incidentId } = request.body

    const service = new CreateDonationService(this.dependencies())

    const donate = await service.execute({
      incidentId,
      donorId
    })

    return response.status(201).json(donate)
  }

  public dependencies(): CreateDonationDependencies {
    const stripe = new StripeProvider()

    const providers = {
      stripe
    }

    const dependencies = {
      providers
    }

    return dependencies
  }
}
