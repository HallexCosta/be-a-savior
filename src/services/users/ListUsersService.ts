import { classToClass } from "class-transformer"

import { User } from '@entities/User'

import { UsersRepository } from '@repositories/UsersRepository'

import { BaseUserService } from '@services/users/BaseUserService'

export type ListUsersServiceDependencies = {
  repositories: {
    users: UsersRepository
  }
}

type ListUsersDTO = {
  owner: string
}

type ListUsersExecuteParams = {
  dto: ListUsersDTO
}

export abstract class ListUsersService extends BaseUserService {
  public async executeUser<ListUsersResponse = User>({
    dto: {
      owner
    }
  }: ListUsersExecuteParams): Promise<ListUsersResponse> {
    const usersRepository = this.repositories.users

    const users = await usersRepository.findByOwner(owner)

    const usersResponse = users.map(user => classToClass<User>(user)) as unknown as ListUsersResponse

    return usersResponse
  }
}
