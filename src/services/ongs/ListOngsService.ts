import { classToClass } from "class-transformer"
import { getCustomRepository } from 'typeorm'

import { Ong } from '@entities/Ong'
import { OngsRepository } from '@repositories/OngsRepository'

type ListOngsResponse = Omit<Ong, 'password'>[]

export class ListOngsService {
  public async execute(): Promise<ListOngsResponse> {
    const ongsRepository = getCustomRepository(OngsRepository)

    const ongs = await ongsRepository.find()

    const ongsResponse = classToClass<ListOngsResponse>(ongs)

    return ongsResponse
  }
}
