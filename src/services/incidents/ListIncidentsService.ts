import { getCustomRepository } from 'typeorm'

import { Incident } from '@entities/Incident'
import { IncidentsRepository } from '@repositories/IncidentsRepository'

type ListIncidentsDTO = {
  ong_id: string
}

export class ListIncidentsService {
  public async execute({ ong_id }: ListIncidentsDTO): Promise<Incident[]> {
    const incidents = await this.findBy(ong_id)

    return incidents
  }

  private async findBy(ong_id?: string): Promise<Incident[]> {
    if (ong_id) {
      return await this.findByOngId(ong_id)
    }

    return await this.findAll()
  }

  private async findAll(): Promise<Incident[]> {
    const repository = getCustomRepository(IncidentsRepository)

    return await repository.find()
  }

  private async findByOngId(ong_id: string): Promise<Incident[]> {
    const repository = getCustomRepository(IncidentsRepository)

    return await repository.findByOngId(ong_id)
  }
}
