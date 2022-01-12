import { classToClass } from 'class-transformer'
import { getCustomRepository } from 'typeorm'
import { hash } from 'bcryptjs'

import { User } from '@entities/User'
import { UsersRepository } from '@repositories/UsersRepository'

export type CreateUserDTO = {
  name: string
  email: string
  password: string
  phone: string
  owner: string
}

type CreateUserParams = {
  dto: CreateUserDTO
}

type CreateUserResponse = Omit<User, 'password'>

export abstract class CreateUserService {
  private async checkForUserEmailExists(
    email: string,
    usersRepository: UsersRepository
  ) {
    const userAlreadyExists = await usersRepository.findByEmail(email)

    if (userAlreadyExists) {
      throw new Error('User already exists, please change your email')
    }
  }

  public async executeUser({
    dto
  }: CreateUserParams): Promise<CreateUserResponse> {
    this.checkForFieldIsFilled(dto)

    const usersRepository = getCustomRepository(UsersRepository)

    await this.checkForUserEmailExists(dto.email, usersRepository)

    const passwordHash = await this.encryptPassword(dto.password)

    const user = usersRepository.create({
      ...dto,
      password: passwordHash,
    })

    await usersRepository.save(user)

    const userResponse = classToClass<CreateUserResponse>(user)

    return userResponse
  }

  private async encryptPassword(password: string) {
    const passwordHash = await hash(password, 8)

    return passwordHash
  }

  private checkForFieldIsFilled({
    name,
    email,
    password,
    phone,
    owner
  }: CreateUserDTO) {
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

    if (!owner) {
      throw new Error("Owner can't empty")
    }
  }
}
