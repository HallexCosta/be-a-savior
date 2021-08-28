import { getCustomRepository } from 'typeorm'

import { Incident } from '@entities/Incident'
import { IncidentsRepository } from '@repositories/IncidentsRepository'
import { OngsRepository } from '@repositories/OngsRepository'

type CreateIncidentDTO = {
  name: string
  coast: number
  description: string
  ong_id: string
}

export class CreateIncidentService {
  public async execute({
    name,
    coast,
    description,
    ong_id
  }: CreateIncidentDTO): Promise<Incident> {
    const repository = getCustomRepository(IncidentsRepository)

    this.checkForFieldIsFilled({
      name,
      coast,
      description,
      ong_id
    })

    await this.checkOngExists(ong_id)

    const incident = repository.create({
      name,
      coast,
      description,
      ong_id
    })

    await repository.save(incident)

    return incident
  }

  private async checkOngExists(ong_id: string): Promise<void> {
    const repository = getCustomRepository(OngsRepository)

    const ong = await repository.findById(ong_id)

    if (!ong) {
      throw new Error('Ong not exists')
    }
  }

  private checkForFieldIsFilled({
    name,
    coast,
    description,
    ong_id
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

    if (!ong_id) {
      throw new Error("Ong Id can't empty")
    }
  }
}
