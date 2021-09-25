import { classToClass } from "class-transformer"
import { getCustomRepository } from 'typeorm'

import { Donor } from '@entities/Donor'
import { DonorsRepository } from '@repositories/DonorsRepository'

type ListDonorsResponse = Omit<Donor, 'password'>[]

export class ListDonorsService {
  public async execute(): Promise<ListDonorsResponse> {
    const donorsRepository = getCustomRepository(DonorsRepository)

    const donors = await donorsRepository.find()

    const donorsResponse = classToClass<ListDonorsResponse>(donors)

    return donorsResponse
  }
}
