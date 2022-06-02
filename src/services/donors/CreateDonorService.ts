import { Donor } from '@entities/Donor'
import { ServiceDependencies } from '@services/BaseService'

import { CreateUserService } from '@services/users/CreateUserService'

type CreateDonorDTO = {
  name: string
  email: string
  password: string
  phone: string
  owner: string
}

type CreateDonorResponse = Omit<Donor, 'password'>

export class CreateDonorService extends CreateUserService {
  public constructor({ repositories, providers }: ServiceDependencies) {
    super(repositories, providers)
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
