import { getCustomRepository } from 'typeorm'

import { Incident } from '@entities/Incident'

import { IncidentsRepository } from '@repositories/IncidentsRepository'

type ListIncidentsDTO = {
  ongId?: string
  donated?: boolean
}

export class ListIncidentsService {
  public async execute({
    ongId,
    donated
  }: ListIncidentsDTO): Promise<Incident[]> {
    const incidentsRepository = getCustomRepository(IncidentsRepository)

    const incidents = await incidentsRepository.findIncidentsByFilter({
      donated,
      ongId
    })

    return incidents
  }
}
