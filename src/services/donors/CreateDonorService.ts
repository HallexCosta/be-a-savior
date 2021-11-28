import { classToClass } from 'class-transformer'
import { getCustomRepository } from 'typeorm'
import { hash } from 'bcryptjs'

import { Donor } from '@entities/Donor'
import { UsersRepository } from '@repositories/UsersRepository'

type CreateDonorDTO = {
  name: string
  email: string
  password: string
  phone: string
}

type CreateDonorResponse = Omit<Donor, 'password'>

export class CreateDonorService {
  private async checkForUserEmailExists(
    email: string,
    usersRepository: UsersRepository
  ) {
    const userAlreadyExists = await usersRepository.findByEmail(email)

    if (userAlreadyExists) {
      throw new Error('User already exists, please change your email')
    }
  }

  public async execute({
    name,
    email,
    password,
    phone
  }: CreateDonorDTO): Promise<CreateDonorResponse> {
    this.checkForFieldIsFilled({
      name,
      email,
      password,
      phone
    })

    const usersRepository = getCustomRepository(UsersRepository)

    await this.checkForUserEmailExists(email, usersRepository)

    const passwordHash = await this.encryptPassword(password)

    const donor = usersRepository.create(new Donor({
      name,
      email,
      password: passwordHash,
      phone
    }))

    await usersRepository.save(donor)

    const donorResponse = classToClass<CreateDonorResponse>(donor)

    return donorResponse
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
