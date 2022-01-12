import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'

import { UsersRepository } from '@repositories/UsersRepository'

import { BaseUserService } from '@services/users/BaseUserService'

type AuthenticateUserDTO = {
  email: string
  password: string
  owner: string
}

type AuthenticateUserExecuteParams = {
  dto: AuthenticateUserDTO
}

export type AuthenticateUserParams = {
  repositories: {
    users: UsersRepository
  }
}

export abstract class AuthenticateUserService extends BaseUserService {
  public constructor(authenticateUserParams: AuthenticateUserParams) {
    super(authenticateUserParams)
  }

  public async executeUser<AuthenticateUserResponse>({
    dto: {
      email,
      password,
      owner
    }
  }: AuthenticateUserExecuteParams): Promise<AuthenticateUserResponse> {
    const usersRepository = this.repositories.users

    const user = await usersRepository.findByEmail(email)

    if (!user) {
      throw new Error('Email/password incorrect')
    }

    const passwordMatch = await compare(
      password,
      user.password
    )

    if (!passwordMatch) {
      throw new Error('Email/password incorrect')
    }

    if (user.owner !== owner) {
      throw new Error(`This user isn't a ${owner}`)
    }

    const token = sign(
      {
        email: user.email
      },
      '47285efa5d652f00fe0371c2e6bdcd0b',
      {
        subject: user.id,
        expiresIn: '1d'
      }
    )

    return token as unknown as AuthenticateUserResponse
  }
}
