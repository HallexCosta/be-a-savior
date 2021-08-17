import { getCustomRepository } from 'typeorm'

import { Ong } from '@entities/Ong'
import { OngsRepository } from '@repositories/OngsRepository'

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
