import { getCustomRepository } from 'typeorm'

import { Donor } from '@entities/Donor'
import { DonorsRepository } from '@repositories/DonorsRepository'

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
