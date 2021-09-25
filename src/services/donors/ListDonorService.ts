import { classToClass } from 'class-transformer'
import { getCustomRepository } from 'typeorm'

import { Donor } from '@entities/Donor'
import { DonorsRepository } from '@repositories/DonorsRepository'

type ListDonorDTO = {
  id: string
}

type ListDonorResponse = Omit<Donor, 'password'>

export class ListDonorService {
  public async execute({ id }: ListDonorDTO): Promise<ListDonorResponse> {
    const donorsRepository = getCustomRepository(DonorsRepository)

    const donor = await donorsRepository.findById(id)

    const donorResponse = classToClass<ListDonorResponse>(donor)

    return donorResponse
  }
}
