import { User } from '@entities/User'
import { UsersRepository } from '@repositories/UsersRepository'

import { StripeProvider } from '@providers/StripeProvider'
import { ElephantSQLInstanceProvider } from '@providers/elephant/ElephantSQLInstanceProvider'
import BaseService from '@services/BaseService'

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
  executeUser(userExecute: UserExecuteParams): Promise<string>
}

export abstract class BaseUserService extends BaseService implements UserService {
  public abstract executeUser(userExecute: UserExecuteParams): Promise<string>
}
