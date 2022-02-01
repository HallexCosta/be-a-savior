import { Donor } from '@entities/Donor'
import { UsersRepository } from '@repositories/UsersRepository'

import { CreateUserService } from '@services/users/CreateUserService'

type CreateDonorDTO = {
  name: string
  email: string
  password: string
  phone: string
  owner: string
}

type CreateDonorResponse = Omit<Donor, 'password'>

type CreateDonorDependencies = {
  repositories: {
    users: UsersRepository
  }
}

export class CreateDonorService extends CreateUserService {
  public constructor(createDonorDependencies: CreateDonorDependencies) {
    super(createDonorDependencies)
  }

  public async execute({
    name,
    email,
    password,
    phone,
    owner
  }: CreateDonorDTO): Promise<CreateDonorResponse> {
    return await super.executeUser({
      dto: {
        name,
        email,
        password,
        phone,
        owner
      }
    })
  }
}
