import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'

import { User } from '@entities/User'

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

  public async executeUser({
    dto: {
      email,
      password,
      owner
    }
  }: AuthenticateUserExecuteParams): Promise<string> {
    const usersRepository = this.repositories.users

    const user = await usersRepository.findByEmail(email) || await usersRepository.findByPhone(email)

    this.checkUserExists(user)

    await this.checkUserPasswordIsValid(password, user.password)

    this.checkUserHaveAccessThisOwner(user.owner, owner)

    return this.signToken(user)
  }

  public checkUserHaveAccessThisOwner(userOwner: string, owner: string) {
    if (userOwner !== owner) {
      throw new Error(`This user isn't a ${owner}`)
    }
  }

  public async checkUserPasswordIsValid(password: string, comparePassword: string) {
    const passwordMatch = await compare(
      password,
      comparePassword
    )

    if (!passwordMatch) {
      throw new Error('Email/password incorrect')
    }
  }

  public checkUserExists(user: User) {
    if (!user) {
      throw new Error('Email/password incorrect')
    }
  }

  public signToken(user: User): string {
    const { password, ...userWithoutPassword } = user

    const token = sign(
      {
        ...userWithoutPassword
      },
      '47285efa5d652f00fe0371c2e6bdcd0b',
      {
        subject: user.id,
        expiresIn: '1d'
      }
    )

    return token
  }
}
