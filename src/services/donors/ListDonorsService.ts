import { Donor } from '@entities/Donor'
import { ServiceDependencies } from '@services/BaseService'

import { ListUsersService } from '@services/users/ListUsersService'

type ListDonorsDTO = {
  owner: string
}

type ListDonorsResponse = Omit<Donor, 'password'>[]

export class ListDonorsService extends ListUsersService {
  public constructor({ repositories, providers }: ServiceDependencies) {
    super(repositories, providers)
  }

  public async execute({ owner }: ListDonorsDTO): Promise<ListDonorsResponse> {
    return await super.executeUser({
      dto: {
        owner
      }
    })
  }
}
