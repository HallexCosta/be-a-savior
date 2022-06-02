import { classToClass } from 'class-transformer'
import { hash } from 'bcryptjs'

import { User } from '@entities/User'
import { UsersRepository } from '@repositories/UsersRepository'

import { StripeProvider } from '@providers/StripeProvider'
import { ElephantSQLInstanceProvider } from '@providers/elephant/ElephantSQLInstanceProvider'
import BaseService from '@services/BaseService'

export type CreateUserDTO = {
  name: string
  email: string
  password: string
  phone: string
  owner: string
}

type Repositories = {
  users?: UsersRepository
}

type Providers = {
  stripe?: StripeProvider
  elephantSQL?: ElephantSQLInstanceProvider
}

export type CreateUserParams = {
  repositories?: Repositories
  providers?: Providers
}

type CreateUserExecuteParams = {
  dto: CreateUserDTO
}

type CreateUserResponse = Omit<User, 'password'>

export abstract class CreateUserService extends BaseService {
  public async checkForUserEmailExists(
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
  }: CreateUserExecuteParams): Promise<CreateUserResponse> {
    this.checkForFieldIsFilled(dto)

    const usersRepository = this.repositories.users

    await this.checkForUserEmailExists(dto.email, usersRepository)

    const passwordHash = await this.encryptPassword(dto.password)

    const user = usersRepository.create({
      ...dto,
      password: passwordHash,
    })

    await usersRepository.save(user)

    const { password, ...userWithoutPassword } = user

    const userResponse = classToClass<CreateUserResponse>(userWithoutPassword)

    return userResponse
  }

  public async encryptPassword(password: string) {
    const passwordHash = await hash(password, 8)

    return passwordHash
  }

  public checkForFieldIsFilled({
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
