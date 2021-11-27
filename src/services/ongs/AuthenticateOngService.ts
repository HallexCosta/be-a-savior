import { compare } from 'bcryptjs'
import { getCustomRepository } from 'typeorm'
import { sign } from 'jsonwebtoken'

import { UsersRepository } from '@repositories/UsersRepository'

type AuthenticateOngDTO = {
  email: string
  password: string
}

export class AuthenticateOngService {
  public async execute({
    email,
    password
  }: AuthenticateOngDTO): Promise<string> {
    const repository = getCustomRepository(UsersRepository)

    const ong = await repository.findByEmail(email)

    if (!ong) {
      throw new Error('Email/password incorrect')
    }

    const passwordMatch = await compare(password, ong.password)

    if (!passwordMatch) {
      throw new Error('Email/password incorrect')
    }

    if (ong.owner !== 'ong') {
      throw new Error("This ong not exists")
    }

    const token = sign(
      {
        email: ong.email
      },
      '47285efa5d652f00fe0371c2e6bdcd0b',
      {
        subject: ong.id,
        expiresIn: '1d'
      }
    )

    return token
  }
}
