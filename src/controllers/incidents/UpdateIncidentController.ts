import { Request, Response } from 'express'

import { UpdateIncidentService } from '@services/incidents/UpdateIncidentService'

export class UpdateIncidentController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const { ong_id: ongId } = request

    const { id } = request.params

    const { name, coast, description } = request.body

    const service = new UpdateIncidentService()

    const incident = await service.execute({
      id,
      name,
      coast,
      description,
      ongId
    })

    return response.json(incident)
  }
}
