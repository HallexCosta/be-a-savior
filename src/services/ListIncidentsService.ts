import { getCustomRepository } from 'typeorm'

import { Incident } from '@entities'
import { IncidentsRepository } from '@repositories'

export class ListIncidentsService {
  public async execute(): Promise<Incident[]> {
    const repository = getCustomRepository(IncidentsRepository)

    const incidents = await repository.find()

    return incidents
  }
}
