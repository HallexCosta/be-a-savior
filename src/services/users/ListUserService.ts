import { classToClass } from 'class-transformer'

import { User } from '@entities/User'
import { UsersRepository } from '@repositories/UsersRepository'

import { StripeProvider } from '@providers/StripeProvider'
import { ElephantSQLInstanceProvider } from '@providers/elephant/ElephantSQLInstanceProvider'

type ListUserDTO = {
  id: string
  owner: string
}

type Repositories = {
  users?: UsersRepository
}

type Providers = {
  stripe?: StripeProvider
  elephantSQL?: ElephantSQLInstanceProvider
}

export type ListUserParams = {
  repositories?: Repositories
  providers?: Providers
}

export type ListUserExecuteParams = {
  dto: ListUserDTO
}

interface UserService {
  executeUser(listUserExecute: ListUserExecuteParams): Promise<ListUserResponse>
}

export type ListUserResponse = Omit<User, 'password'>

export abstract class ListUserService implements UserService {
  public repositories: Repositories
  public providers: Providers

  public constructor(listUserParams: ListUserParams) {
    Object.assign(this, listUserParams)
  }

  public async executeUser({ dto: { id, owner } }: ListUserExecuteParams): Promise<ListUserResponse> {
    const usersRepository = this.repositories.users

    const user = await usersRepository.findOwnerById(id, owner)

    const userResponse = classToClass<ListUserResponse>(user)

    return userResponse
  }
}
