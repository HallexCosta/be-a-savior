import { classToClass } from 'class-transformer'
import { getCustomRepository } from 'typeorm'

import { User } from '@entities/User'
import { UsersRepository } from '@repositories/UsersRepository'

type ListUserDTO = {
  id: string
  owner: string
}
type ListUserParams = {
  dto: ListUserDTO
}

interface UserService {
  executeUser(userExecute: ListUserParams): Promise<ListUserResponse>
}

export type ListUserResponse = Omit<User, 'password'>

export abstract class ListUserService implements UserService {
  public async executeUser({ dto: { id, owner } }: ListUserParams): Promise<ListUserResponse> {
    const usersRepository = getCustomRepository(UsersRepository)

    const user = await usersRepository.findOwnerById(id, owner)

    const userResponse = classToClass<ListUserResponse>(user)

    return userResponse
  }
}
