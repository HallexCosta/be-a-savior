import { Request, Response } from 'express'

import { StripeProvider } from '@providers/StripeProvider'

import { CreateUserController } from '@controllers/users/CreateUserController'

import {
  CreateOngDependencies,
  CreateOngService
} from '@services/ongs/CreateOngService'

export class CreateOngController extends CreateUserController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const { name, email, password, phone } = request.body
    request.owner = 'ong'

    const service = new CreateOngService(this.dependencies())

    return await super.handle({
      service,
      http: {
        request,
        response
      }
    })
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
