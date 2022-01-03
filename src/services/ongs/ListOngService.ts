import { ListUserService, ListUserResponse } from '@services/users/ListUserService'

type ListOngDTO = {
  id: string
  owner: string
}

export class ListOngService extends ListUserService {
  public async execute({ id, owner }: ListOngDTO): Promise<ListUserResponse> {
    return await super.executeUser({
      dto: {
        id,
        owner
      }
    })
  }
}
