import { getCustomRepository } from 'typeorm'

import { Donor } from '@entities'
import { DonorsRepository } from '@repositories'

export class ListDonorsService {
  public async execute(): Promise<Donor[]> {
    const donorsRepository = getCustomRepository(DonorsRepository)

    const donors = await donorsRepository.find()

    return donors
  }
}
