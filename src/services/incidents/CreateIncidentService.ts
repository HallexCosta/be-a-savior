import { getCustomRepository } from 'typeorm'

import { Incident } from '@entities/Incident'
import { IncidentsRepository } from '@repositories/IncidentsRepository'
import { OngsRepository } from '@repositories/OngsRepository'

type CreateIncidentDTO = {
  name: string
  coast: number
  description: string
  ongId: string
}

export class CreateIncidentService {
  public async execute({
    name,
    coast,
    description,
    ongId
  }: CreateIncidentDTO): Promise<Incident> {
    const incidentsRepository = getCustomRepository(IncidentsRepository)

    this.checkForFieldIsFilled({
      name,
      coast,
      description,
      ongId
    })

    const incident = incidentsRepository.create({
      name,
      coast,
      description,
      ong_id: ongId
    })

    await incidentsRepository.save(incident)

    return incident
  }

  private checkForFieldIsFilled({
    name,
    coast,
    description,
    ongId
  }: CreateIncidentDTO) {
    if (!name) {
      throw new Error("Name can't empty")
    }

    if (!coast) {
      throw new Error("Coast can't empty")
    }

    if (!description) {
      throw new Error("Description can't empty")
    }

    if (!ongId) {
      throw new Error("Ong Id can't empty")
    }
  }
}
