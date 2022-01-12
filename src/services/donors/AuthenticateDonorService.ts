import { UsersRepository } from '@repositories/UsersRepository'

import { AuthenticateUserService } from '@services/users/AuthenticateUserService'

type AuthenticateDonorDTO = {
  email: string
  password: string
  owner: string
}

type AuthenticateDonorDependencies = {
  repositories: {
    users: UsersRepository
  }
}

export class AuthenticateDonorService extends AuthenticateUserService {
  public constructor(authenticateDonorDependencies: AuthenticateDonorDependencies) {
    super(authenticateDonorDependencies)
  }

  public async execute({
    email,
    password,
    owner
  }: AuthenticateDonorDTO): Promise<string> {
    return await super.executeUser({
      dto: {
        email,
        password,
        owner
      }
    })
  }
}
