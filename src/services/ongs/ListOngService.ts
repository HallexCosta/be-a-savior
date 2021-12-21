import { classToClass } from 'class-transformer'
import { getCustomRepository } from 'typeorm'

import { Ong } from '@entities/Ong'
import { UsersRepository } from '@repositories/UsersRepository'

type ListOngDTO = {
  id: string
}

type ListOngResponse = Omit<Ong, 'password'>

export class ListOngService {
  public async execute({ id }: ListOngDTO): Promise<ListOngResponse> {
    const ongsRepository = getCustomRepository(UsersRepository)

    const ong = await ongsRepository.findById(id)

    const ongResponse = classToClass<ListOngResponse>(ong)

    return ongResponse
  }
}
