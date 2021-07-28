import { Request, Response } from 'express'

import { DeleteIncidentService } from '@services'

export class DeleteIncidentController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params

    const service = new DeleteIncidentService()

    const incident = await service.execute({ id })

    return response.json(incident)
  }
}
