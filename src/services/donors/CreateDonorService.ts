import { getCustomRepository } from 'typeorm'
import { hash } from 'bcryptjs'

import { Donor } from '@entities/Donor'
import { DonorsRepository } from '@repositories/DonorsRepository'
import { OngsRepository } from '@repositories/OngsRepository'

type CreateDonorDTO = {
  name: string
  email: string
  password: string
  phone: string
}

type Repository = {
  donors: DonorsRepository
  ongs: OngsRepository
}

export class CreateDonorService {
  private async checkForUserEmailExists(
    email: string,
    { donors, ongs }: Repository
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

  public async execute({
    name,
    email,
    password,
    phone
  }: CreateDonorDTO): Promise<Donor> {
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

    const donor = donorsRepository.create({
      name,
      email,
      password: passwordHash,
      phone
    })

    await donorsRepository.save(donor)

    return donor
  }

  private async encryptPassword(password: string) {
    const passwordHash = await hash(password, 8)

    return passwordHash
  }

  private checkForFieldIsFilled({
    name,
    email,
    password,
    phone
  }: CreateDonorDTO) {
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
