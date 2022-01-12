import { classToClass } from 'class-transformer'

import { Ong } from '@entities/Ong'

import { StripeProvider } from '@providers/StripeProvider'

import { CreateUserService } from '@services/users/CreateUserService'

export type CreateOngDTO = {
  name: string
  email: string
  password: string
  phone: string
  owner: string
}

type Providers = {
  stripe: StripeProvider
}

export type CreateOngDependencies = {
  providers: Providers
}

type CreateOngResponse = Omit<Ong, 'password'>

type CreateCustomerParams = {
  name: string
  email: string
  address: {
    line1: string
    line2: string
    city: string
    state: string
    postal_code: string
  }
  metadata: {
    [key: string]: string
  }
}

export class CreateOngService extends CreateUserService {
  private providers: Providers

  public constructor(deps: CreateOngDependencies) {
    super()
    Object.assign(this, deps)
  }

  public async execute({
    name,
    email,
    password,
    phone,
    owner
  }: CreateOngDTO): Promise<CreateOngResponse> {
    const ong = await super.executeUser({
      dto: {
        name,
        email,
        password,
        phone,
        owner
      }
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

    await this.createCustomer(customer)

    const ongResponse = classToClass<CreateOngResponse>(ong)

    return ongResponse
  }

  private async createCustomer(customer: CreateCustomerParams) {
    await this.providers.stripe.customers.create(customer)
  }
}
