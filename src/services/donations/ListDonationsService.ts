import { getCustomRepository } from 'typeorm'

import { DonationsRepository } from '@repositories/DonationsRepository'

import { Donation } from '@entities/Donation'

export class ListDonationsService {
  public async execute(): Promise<Donation[]> {
    const repository = getCustomRepository(DonationsRepository)

    const donations = await repository.find()

    return donations
  }
}
