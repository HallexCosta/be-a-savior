import { Ong } from '@entities/Ong'
import { UsersRepository } from '@repositories/UsersRepository'

import { ListUsersService } from '@services/users/ListUsersService'

type ListOngsServiceDependencies = {
  repositories: {
    users: UsersRepository
  }
}

type ListOngDTO = {
  owner?: string
}

type ListOngsResponse = Omit<Ong, 'password'>[]

export class ListOngsService extends ListUsersService {
  public constructor(listOngsServiceDependencies: ListOngsServiceDependencies) {
    super(listOngsServiceDependencies)
  }

  public async execute({ owner }: ListOngDTO): Promise<ListOngsResponse> {
    return await super.executeUser({
      dto: {
        owner
      }
    })
  }
}
