import { Request, Response } from 'express'

import { CreateIncidentService } from '@services/incidents/CreateIncidentService'

export class CreateIncidentController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const { ong_id: ongId } = request

    const { name, coast, description } = request.body

    const service = new CreateIncidentService()

    const incident = await service.execute({
      name,
      coast,
      description,
      ongId
    })

    return response.status(201).json(incident)
  }
}
