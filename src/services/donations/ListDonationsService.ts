import { getCustomRepository } from 'typeorm'

import { DonationsRepository } from '@repositories/DonationsRepository'

import { Donation } from '@entities/Donation'

type ListDonationsDTO = {
  ongId: string
}

export class ListDonationsService {
  public async execute({ ongId }: ListDonationsDTO): Promise<Donation[]> {
    const donations = await this.getDonations(ongId)

    return donations
  }

  public async getDonations(ongId?: string): Promise<Donation[]> {
    const repository = getCustomRepository(DonationsRepository)

    if (ongId) {
      return await repository.findByOngId(ongId)
    }

    return await repository.findAll()
  }
}
