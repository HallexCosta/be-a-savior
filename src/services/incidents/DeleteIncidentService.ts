import { DeleteResult, getCustomRepository } from 'typeorm'

import { Incident } from '@entities/Incident'
import { IncidentsRepository } from '@repositories/IncidentsRepository'

type DeleteIncidentDTO = {
  id: string
}

export class DeleteIncidentService {
  public async execute({ id }: DeleteIncidentDTO): Promise<Incident> {
    const repository = getCustomRepository(IncidentsRepository)

    const incident = await repository.findById(id)

    this.checkIncidentExists(incident)

    const result = await repository.deleteById(id)

    this.checkIncidentDeleteWithSuccess(result)

    return incident
  }

  private checkIncidentExists(incident: Incident): void {
    if (!incident) {
      throw new Error('Incident not exists')
    }
  }

  private checkIncidentDeleteWithSuccess(result: DeleteResult): void {
    if (result.affected <= 0) {
      throw new Error('Unable to delete the incident')
    }
  }
}
