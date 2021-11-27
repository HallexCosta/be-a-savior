import { classToClass } from "class-transformer"
import { getCustomRepository } from 'typeorm'

import { Donor } from '@entities/Donor'
import { UsersRepository } from '@repositories/UsersRepository'

type ListDonorsResponse = Omit<Donor, 'password'>[]

export class ListDonorsService {
  public async execute(): Promise<ListDonorsResponse> {
    const usersRepository = getCustomRepository(UsersRepository)

    const donors = await usersRepository.findByOwner('donor')

    const donorsResponse = classToClass<ListDonorsResponse>(donors)

    return donorsResponse
  }
}
