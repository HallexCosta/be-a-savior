import { User } from '@entities/User'
import { UsersRepository } from '@repositories/UsersRepository'

import { StripeProvider } from '@providers/StripeProvider'
import { ElephantSQLInstanceProvider } from '@providers/elephant/ElephantSQLInstanceProvider'

type UserDTO = Partial<
  Omit<User, 'created_at' | 'updated_at'>
>

type Repositories = {
  users?: UsersRepository
}

type Providers = {
  stripe?: StripeProvider
  elephantSQL?: ElephantSQLInstanceProvider
}

export type UserParams = {
  repositories?: Repositories
  providers?: Providers
}

export type UserExecuteParams = {
  dto: UserDTO
}

interface UserService {
  executeUser<UserResponse>(userExecute: UserExecuteParams): Promise<UserResponse>
}

export abstract class BaseUserService implements UserService {
  public repositories: Repositories
  public providers: Providers

  public constructor(userParams: UserParams) {
    Object.assign(this, userParams)
  }

  public abstract executeUser<UserResponse>(userExecute: UserExecuteParams): Promise<UserResponse>
}
