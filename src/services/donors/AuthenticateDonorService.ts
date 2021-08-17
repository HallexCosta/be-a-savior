import { compare } from 'bcryptjs'
import { getCustomRepository } from 'typeorm'
import { sign } from 'jsonwebtoken'

import { DonorsRepository } from '@repositories/DonorsRepository'

type AuthenticateDonorDTO = {
  email: string
  password: string
}

export class AuthenticateDonorService {
  public async execute({
    email,
    password
  }: AuthenticateDonorDTO): Promise<string> {
    const repository = getCustomRepository(DonorsRepository)

    const donor = await repository.findByEmail(email)

    if (!donor) {
      throw new Error('Email/password incorrect')
    }

    const passwordMatch = await compare(password, donor.password)

    if (!passwordMatch) {
      throw new Error('Email/password incorrect')
    }

    const token = sign(
      {
        email: donor.email
      },
      '47285efa5d652f00fe0371c2e6bdcd0b',
      {
        subject: donor.id,
        expiresIn: '1d'
      }
    )

    return token
  }
}
