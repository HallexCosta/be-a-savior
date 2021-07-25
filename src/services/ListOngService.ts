import { getCustomRepository } from 'typeorm'

import { Ong } from '@entities'
import { OngsRepository } from '@repositories'

type ListOngDTO = {
  id: string
}

export class ListOngService {
  public async execute({ id }: ListOngDTO): Promise<Ong> {
    const ongsRepository = getCustomRepository(OngsRepository)

    const ong = await ongsRepository.findById(id)

    return ong
  }
}
