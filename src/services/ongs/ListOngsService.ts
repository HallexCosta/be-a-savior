import { getCustomRepository } from 'typeorm'

import { Ong } from '@entities/Ong'
import { OngsRepository } from '@repositories/OngsRepository'

export class ListOngsService {
  public async execute(): Promise<Ong[]> {
    const ongsRepository = getCustomRepository(OngsRepository)

    const ongs = await ongsRepository.find()

    return ongs
  }
}
