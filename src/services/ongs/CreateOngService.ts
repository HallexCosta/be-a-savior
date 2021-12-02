import { getCustomRepository } from 'typeorm'
import { classToClass } from 'class-transformer'
import { hash } from 'bcryptjs'

import { Ong } from '@entities/Ong'
import { UsersRepository } from '@repositories/UsersRepository'

import { StripeProvider } from '@providers/StripeProvider'

export type CreateOngDTO = {
  name: string
  email: string
  password: string
  phone: string
}

type Providers = {
  stripe: StripeProvider
}

export type CreateOngDependencies = {
  providers: Providers
}

type CreateOngResponse = Omit<Ong, 'password'>

export class CreateOngService {
  private providers: Providers

  public constructor(deps: CreateOngDependencies) {
    Object.assign(this, deps)
  }

  public async execute({
    name,
    email,
    password,
    phone
  }: CreateOngDTO): Promise<CreateOngResponse> {
    this.checkForFieldIsFilled({
      name,
      email,
      password,
      phone
    })

    const usersRepository = getCustomRepository(UsersRepository)

    await this.checkForUserEmailExists(email, usersRepository)

    const passwordHash = await this.encryptPassword(password)

    const ong = usersRepository.create(new Ong({
      name,
      email,
      password: passwordHash,
      phone
    }))

    const customer = {
      name,
      email,
      address: {
        line1: 'Madalena Lourenço Bruno',
        line2: '501',
        city: 'Araçatuba',
        state: 'SP',
        postal_code: '16021-305'
      },
      metadata: {
        ong_id: ong.id
      }
    }

    await this.providers.stripe.customers.create(customer)

    await usersRepository.save(ong)

    const ongResponse = classToClass<CreateOngResponse>(ong)

    return ongResponse
  }

  private async checkForUserEmailExists(
    email: string,
    usersRepository: UsersRepository
  ) {
    const userAlreadyExists = await usersRepository.findByEmail(email)

    if (userAlreadyExists) {
      throw new Error('User already exists, please change your email')
    }
  }

  private async encryptPassword(password: string): Promise<string> {
    const passwordHash = await hash(password, 8)

    return passwordHash
  }

  private checkForFieldIsFilled({
    name,
    email,
    password,
    phone
  }: CreateOngDTO): void {
    if (!name) {
      throw new Error("Name can't empty")
    }

    if (!email) {
      throw new Error("Email can't empty")
    }

    if (!password) {
      throw new Error("Password can't empty")
    }

    if (!phone) {
      throw new Error("Phone can't empty")
    }
  }
}
