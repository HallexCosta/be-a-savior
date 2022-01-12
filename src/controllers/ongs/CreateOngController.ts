import { Request, Response } from 'express'

import { StripeProvider } from '@providers/StripeProvider'

import { CreateUserController } from '@controllers/users/CreateUserController'

import {
  CreateOngDependencies,
  CreateOngService
} from '@services/ongs/CreateOngService'

export class CreateOngController extends CreateUserController {
  public async handle(request: Request, response: Response): Promise<Response> {
    request.owner = 'ong'

    return await super.handleUser({
      service: new CreateOngService(this.dependencies()),
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
