import { getCustomRepository } from 'typeorm'

import { Ong } from '@entities'
import { OngsRepository } from '@repositories'

export class ListOngsService {
  public async execute(): Promise<Ong[]> {
    const ongsRepository = getCustomRepository(OngsRepository)

    const ongs = await ongsRepository.find()

    return ongs
  }
}
