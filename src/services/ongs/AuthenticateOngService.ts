import { AuthenticateUserService, AuthenticateUserParams } from '@services/users/AuthenticateUserService'

type AuthenticateOngDTO = {
  email: string
  password: string
  owner: string
}

type AuthenticateOngParams = AuthenticateUserParams & {}

export class AuthenticateOngService extends AuthenticateUserService {
  public constructor(authenticateOngParams: AuthenticateOngParams) {
    super(authenticateOngParams)
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
