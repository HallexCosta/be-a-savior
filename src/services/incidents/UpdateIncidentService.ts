import { getCustomRepository } from 'typeorm'

import { Incident } from '@entities/Incident'
import { IncidentsRepository } from '@repositories/IncidentsRepository'

type UpdateIncidentDTO = {
  id: string
  name: string
  cost: number
  description: string
  ongId: string
}

export class UpdateIncidentService {
  public async execute({
    id,
    name,
    cost,
    description,
    ongId
  }: UpdateIncidentDTO): Promise<Incident> {
    const incidentsRepository = getCustomRepository(IncidentsRepository)

    const incidentAlreadyExists = await incidentsRepository.findById(id)

    this.checkIncidentExists(incidentAlreadyExists)

    this.checkIncidentBelongsThisOng(ongId, incidentAlreadyExists.ong_id)

    const incident = incidentsRepository.create({
      ...incidentAlreadyExists,
      name,
      cost,
      description
    })

    await incidentsRepository.update(
      {
        id
      },
      incident
    )

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
}
