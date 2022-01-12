import { Donor } from '@entities/Donor'
import { UsersRepository } from '@repositories/UsersRepository'

import { ListUserService } from '@services/users/ListUserService'

type ListDonorDTO = {
  id: string
  owner: string
}

type ListDonorResponse = Omit<Donor, 'password'>

type ListDonorDependencies = {
  repositories: {
    users: UsersRepository
  }
}

export class ListDonorService extends ListUserService {
  public constructor(listDonorServiceDependencies: ListDonorDependencies) {
    super(listDonorServiceDependencies)
  }

  public async execute({ id, owner }: ListDonorDTO): Promise<ListDonorResponse> {
    return await super.executeUser({
      dto: {
        id,
        owner
      }
    })
  }
}
