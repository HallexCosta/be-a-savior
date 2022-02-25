import { DeleteResult } from 'typeorm'

import { Incident } from '@entities/Incident'
import { IncidentsRepository } from '@repositories/IncidentsRepository'

type DeleteIncidentDTO = {
  id: string
  ongId: string
}

export type DeleteIncidentRepositories = {
  incidents: IncidentsRepository
}

export type DeleteIncidentDependencies = {
  repositories: DeleteIncidentRepositories
}

export class DeleteIncidentService {
  private readonly repositories: DeleteIncidentRepositories

  public constructor(deleteIncidentDependencies: DeleteIncidentDependencies) {
    Object.assign(this, deleteIncidentDependencies)
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
