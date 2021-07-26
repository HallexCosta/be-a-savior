import { Request, Response } from 'express'

import { CreateIncidentService } from '@services'

export class CreateIncidentController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const { name, coast, description, ong_id } = request.body

    const service = new CreateIncidentService()

    const incident = await service.execute({
      name,
      coast,
      description,
      ong_id
    })

    return response.status(201).json(incident)
  }
}
