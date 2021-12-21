import { getCustomRepository } from 'typeorm'

import { Incident } from '@entities/Incident'
import { IncidentsRepository } from '@repositories/IncidentsRepository'

type CreateIncidentDTO = {
  name: string
  cost: number
  description: string
  ongId: string
}

export class CreateIncidentService {
  public async execute({
    name,
    cost,
    description,
    ongId
  }: CreateIncidentDTO): Promise<Incident> {
    const incidentsRepository = getCustomRepository(IncidentsRepository)

    this.checkForFieldIsFilled({
      name,
      cost,
      description,
      ongId
    })

    const incident = incidentsRepository.create({
      name,
      cost,
      description,
      user_id: ongId
    })

    await incidentsRepository.save(incident)

    return incident
  }

  private checkForFieldIsFilled({
    name,
    cost,
    description,
    ongId
  }: CreateIncidentDTO) {
    if (!name) {
      throw new Error("Name can't empty")
    }

    if (!cost) {
      throw new Error("Cost can't empty")
    }

    if (!description) {
      throw new Error("Description can't empty")
    }

    if (!ongId) {
      throw new Error("Ong Id can't empty")
    }
  }
}
