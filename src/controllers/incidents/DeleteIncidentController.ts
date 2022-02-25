import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'

import { DeleteIncidentService, DeleteIncidentDependencies } from '@services/incidents/DeleteIncidentService'

import { IncidentsRepository } from '@repositories/IncidentsRepository'

export class DeleteIncidentController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const { ong_id: ongId } = request

    const { id } = request.params

    const service = new DeleteIncidentService(
      this.deleteIncidentDependencies()
    )

    const incident = await service.execute({ id, ongId })

    return response.json(incident)
  }

  public deleteIncidentDependencies(): DeleteIncidentDependencies {
    return {
      repositories: {
        incidents: getCustomRepository(IncidentsRepository)
      }
    }
  }
}
