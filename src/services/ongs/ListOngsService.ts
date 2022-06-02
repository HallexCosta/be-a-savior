import { Ong } from '@entities/Ong'
import { ServiceDependencies } from '@services/BaseService'

import { ListUsersService } from '@services/users/ListUsersService'

type ListOngDTO = {
  owner?: string
}

type ListOngsResponse = Omit<Ong, 'password'>[]

export class ListOngsService extends ListUsersService {
  public constructor({ repositories, providers }: ServiceDependencies) {
    super(repositories, providers)
  }

  public async execute({ owner }: ListOngDTO): Promise<ListOngsResponse> {
    return await super.executeUser({
      dto: {
        owner
      }
    })
  }
}
