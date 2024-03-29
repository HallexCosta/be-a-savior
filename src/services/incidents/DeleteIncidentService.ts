import { DeleteResult } from 'typeorm'

import { Incident } from '@entities/Incident'
import BaseService, { ServiceDependencies } from '@services/BaseService'

type DeleteIncidentDTO = {
  id: string
  ongId: string
}

export class DeleteIncidentService extends BaseService {
  public constructor({ repositories, providers }: ServiceDependencies) {
    super(repositories, providers)
  }

  public async execute({ id, ongId }: DeleteIncidentDTO): Promise<Incident> {
    const repository = this.repositories.incidents

    const incident = await repository.findById(id)

    this.checkIncidentExists(incident)
    this.checkIncidentBelongsThisOng(ongId, incident.user_id)
    this.checkIncidentsHaveDonations(incident)

    const result = await repository.deleteById(id)

    this.checkIncidentDeleteWithSuccess(result)

    return incident
  }

  public checkIncidentsHaveDonations(incident: Incident): void {
    const haveDonations = incident.donations.length > 0

    if (haveDonations)
      throw new Error("It isn't possible delete incident that have donations")
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
