import { getCustomRepository } from 'typeorm'

import { Incident } from '@entities/Incident'
import { IncidentsRepository } from '@repositories/IncidentsRepository'

type ListIncidentDTO = {
  id: string
}

export class ListIncidentService {
  public async execute({ id }: ListIncidentDTO): Promise<Incident> {
    const incidentsRepository = getCustomRepository(IncidentsRepository)

    const incident = await incidentsRepository.findById(id)

    return incident
  }
}
