import { Request, Response, IRouter } from 'express'
import { getCustomRepository } from 'typeorm'

import { Logger } from '@common/logger'
import { CreateUserController } from '@controllers/users/CreateUserController'

import {
  CreateOngDependencies,
  CreateOngService
} from '@services/ongs/CreateOngService'

import { StripeProvider } from '@providers/StripeProvider'
import { UsersRepository } from '@repositories/UsersRepository'

export class CreateOngController
extends CreateUserController {
  protected readonly group: string = '/ongs'  
  protected readonly path: string = '/'  
  protected readonly method: string = 'POST'

  public constructor(
    logger: Logger,
    routes: IRouter
  ) {
   super(logger, routes)
   this.subscribe({
     group: this.group,
     path: this.path,
     method: this.method,
     handler: this.handle.bind(this)
   })
  }
  public async handle(request: Request, response: Response): Promise<Response> {
    request.owner = 'ong'

    this.endpointAccessLog(
      this.method,
      this.group.concat('', this.path),
      'guest'
    )

    return await super.handleUser({
      service: new CreateOngService(
        this.createOngServiceDependencies()
      ),
      http: {
        request,
        response
      }
    })
  }

  public createOngServiceDependencies(): CreateOngDependencies {
    return {
      repositories: {
        users: getCustomRepository(UsersRepository)
      },
      providers: {
        stripe: new StripeProvider()
      }
    }
  }
}
