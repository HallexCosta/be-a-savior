import { Donor } from '@entities/Donor'
import { UsersRepository } from '@repositories/UsersRepository'

import { ListUsersService } from '@services/users/ListUsersService'

type ListDonorsDTO = {
  owner: string
}

type ListDonorsResponse = Omit<Donor, 'password'>[]

type ListDonorsDependencies = {
  repositories: {
    users: UsersRepository
  }
}

export class ListDonorsService extends ListUsersService {
  public constructor(listDonorsDependencies: ListDonorsDependencies) {
    super(listDonorsDependencies)
  }

  public async execute({ owner }: ListDonorsDTO): Promise<ListDonorsResponse> {
    return await super.executeUser({
      dto: {
        owner
      }
    })
  }
}
