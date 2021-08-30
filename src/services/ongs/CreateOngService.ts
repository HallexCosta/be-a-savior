import { getCustomRepository } from 'typeorm'
import { hash } from 'bcryptjs'

import { Ong } from '@entities/Ong'
import { OngsRepository } from '@repositories/OngsRepository'
import { DonorsRepository } from '@repositories/DonorsRepository'

import { StripeProvider } from '@providers/StripeProvider'

export type CreateOngDTO = {
  name: string
  email: string
  password: string
  phone: string
}

type Repositories = {
  donors: DonorsRepository
  ongs: OngsRepository
}

export class CreateOngService {
  private readonly provider: StripeProvider

  public constructor() {
    this.provider = new StripeProvider()
  }

  public async execute({
    name,
    email,
    password,
    phone
  }: CreateOngDTO): Promise<Ong> {
    this.checkForFieldIsFilled({
      name,
      email,
      password,
      phone
    })

    const donorsRepository = getCustomRepository(DonorsRepository)
    const ongsRepository = getCustomRepository(OngsRepository)

    await this.checkForUserEmailExists(email, {
      donors: donorsRepository,
      ongs: ongsRepository
    })

    const passwordHash = await this.encryptPassword(password)

    const ong = ongsRepository.create({
      name,
      email,
      password: passwordHash,
      phone
    })

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

    await this.provider.customers.create(customer)

    await ongsRepository.save(ong)

    return ong
  }

  private async checkForUserEmailExists(
    email: string,
    { donors, ongs }: Repositories
  ) {
    const donorAlreadyExists = await donors.findByEmail(email)

    if (donorAlreadyExists) {
      throw new Error('User already exists, please change your email')
    }

    const ongAlreadyExists = await ongs.findByEmail(email)

    if (ongAlreadyExists) {
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
