import { getCustomRepository } from 'typeorm'

import { DonationsRepository } from '@repositories/DonationsRepository'

import { Donation } from '@entities/Donation'

import { Util } from '@common/util'

type ListDonationsDTO = {
  donorId?: string
}

export class ListDonationsService {
  public async execute({ donorId }: ListDonationsDTO): Promise<Donation[]> {
    const repository = getCustomRepository(DonationsRepository)

    if (Util.isUUID(donorId)) {
      return await repository.findByDonorId(donorId)
    }

    return await repository.findAll() || []
  }
}
