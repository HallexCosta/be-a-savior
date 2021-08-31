import { Request, Response } from 'express'

import { DeleteIncidentService } from '@services/incidents/DeleteIncidentService'

export class DeleteIncidentController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const { ong_id: ongId } = request

    const { id } = request.params

    const service = new DeleteIncidentService()

    const incident = await service.execute({ id, ongId })

    return response.json(incident)
  }
}
