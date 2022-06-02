import { ServiceDependencies } from '@services/BaseService'
import {
  ListUserService,
  ListUserResponse
} from '@services/users/ListUserService'

type ListOngDTO = {
  id: string
  owner: string
}

export class ListOngService extends ListUserService {
  public constructor({ repositories, providers }: ServiceDependencies) {
    super(repositories, providers)
  }

  public async execute({ id, owner }: ListOngDTO): Promise<ListUserResponse> {
    return await super.executeUser({
      dto: {
        id,
        owner
      }
    })
  }
}
