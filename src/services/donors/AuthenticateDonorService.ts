import { ServiceDependencies } from '@services/BaseService'

import { AuthenticateUserService } from '@services/users/AuthenticateUserService'

type AuthenticateDonorDTO = {
  email: string
  password: string
  owner: string
}

export class AuthenticateDonorService extends AuthenticateUserService {
  public constructor({ repositories, providers }: ServiceDependencies) {
    super(repositories, providers)
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
