import { getCustomRepository } from 'typeorm'

import { Incident } from '@entities'
import { IncidentsRepository } from '@repositories'

type UpdateIncidentDTO = {
  id: string
  name: string
  coast: number
  description: string
}

export class UpdateIncidentService {
  public async execute({
    id,
    name,
    coast,
    description
  }: UpdateIncidentDTO): Promise<Incident> {
    const incidentsRepository = getCustomRepository(IncidentsRepository)

    const incidentAlreadyExists = await incidentsRepository.findById(id)

    this.checkIncidentExists(incidentAlreadyExists)

    const incident = incidentsRepository.create({
      ...incidentAlreadyExists,
      name,
      coast,
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

  public checkIncidentExists(incident: Incident): void {
    if (!incident) {
      throw new Error('Incident not exists')
    }
  }
}
