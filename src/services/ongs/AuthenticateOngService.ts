import { ServiceDependencies } from '@services/BaseService'
import { AuthenticateUserService } from '@services/users/AuthenticateUserService'

type AuthenticateOngDTO = {
  email: string
  password: string
  owner: string
}

export class AuthenticateOngService extends AuthenticateUserService {
  public constructor({ repositories, providers }: ServiceDependencies) {
    super(repositories, providers)
  }

  public async execute({
    email,
    password,
    owner
  }: AuthenticateOngDTO): Promise<string> {
    return await super.executeUser({
      dto: {
        email,
        password,
        owner
      }
    })
  }
}
