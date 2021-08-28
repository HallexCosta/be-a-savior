import { Request, Response } from 'express'

import { ListIncidentService } from '@services/incidents/ListIncidentService'

export class ListIncidentController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params

    const service = new ListIncidentService()

    const incident = await service.execute({ id })

    return response.json(incident)
  }
}
