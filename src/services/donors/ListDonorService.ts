import { getCustomRepository } from 'typeorm'

import { Donor } from '@entities'
import { DonorsRepository } from '@repositories'

type ListDonorDTO = {
  id: string
}

export class ListDonorService {
  public async execute({ id }: ListDonorDTO): Promise<Donor> {
    const donorsRepository = getCustomRepository(DonorsRepository)

    const donor = await donorsRepository.findById(id)

    return donor
  }
}
