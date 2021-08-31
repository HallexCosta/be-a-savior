import { DeleteResult, getCustomRepository } from 'typeorm'

import { Incident } from '@entities/Incident'
import { IncidentsRepository } from '@repositories/IncidentsRepository'

type DeleteIncidentDTO = {
  id: string
  ongId: string
}

export class DeleteIncidentService {
  public async execute({ id, ongId }: DeleteIncidentDTO): Promise<Incident> {
    const repository = getCustomRepository(IncidentsRepository)

    const incident = await repository.findById(id)

    this.checkIncidentExists(incident)

    this.checkIncidentBelongsThisOng(ongId, incident.ong_id)

    const result = await repository.deleteById(id)

    this.checkIncidentDeleteWithSuccess(result)

    return incident
  }

  private checkIncidentBelongsThisOng(
    ongId: string,
    ongIdFromIncident: string
  ) {
    if (ongId !== ongIdFromIncident) {
      throw new Error('This incident not belong this ong')
    }
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
