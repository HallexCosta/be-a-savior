import { Request, Response } from 'express'

import { StripeProvider } from '@providers/StripeProvider'

import {
  CreateOngDependencies,
  CreateOngService
} from '@services/ongs/CreateOngService'

export class CreateOngController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const { name, email, password, phone } = request.body

    const service = new CreateOngService(this.dependencies())

    const user = await service.execute({
      name,
      email,
      password,
      phone
    })

    return response.status(201).json(user)
  }

  public dependencies(): CreateOngDependencies {
    const stripe = new StripeProvider()

    const providers = {
      stripe
    }

    const dependencies = {
      providers
    }

    return dependencies
  }
}
