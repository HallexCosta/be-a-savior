import { Request, Response } from 'express'

import { CreateIncidentService } from '@services/incidents/CreateIncidentService'

export class CreateIncidentController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const { ong_id: ongId } = request

    const { name, cost, description } = request.body

    const service = new CreateIncidentService()

    const incident = await service.execute({
      name,
      cost,
      description,
      ongId
    })

    return response.status(201).json(incident)
  }
}
