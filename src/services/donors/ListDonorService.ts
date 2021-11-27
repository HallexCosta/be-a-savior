import { classToClass } from 'class-transformer'
import { getCustomRepository } from 'typeorm'

import { Donor } from '@entities/Donor'
import { UsersRepository } from '@repositories/UsersRepository'

type ListDonorDTO = {
  id: string
}

type ListDonorResponse = Omit<Donor, 'password'>

export class ListDonorService {
  public async execute({ id }: ListDonorDTO): Promise<ListDonorResponse> {
    const donorsRepository = getCustomRepository(UsersRepository)

    const donor = await donorsRepository.findById(id)

    const donorResponse = classToClass<ListDonorResponse>(donor)

    return donorResponse
  }
}
