import { IRouter, Request, Response } from 'express'

import { Logger } from '@common/logger'

import BaseController from '@controllers/BaseController'

import { StripeProvider } from '@providers/StripeProvider'

import { ConnectionPlugin } from '@database/ConnectionAdapter'
import { DonationsRepository } from '@repositories/DonationsRepository'
import { UsersRepository } from '@repositories/UsersRepository'
import { IncidentsRepository } from '@repositories/IncidentsRepository'

import {
  CreateDonationService
} from '@services/donations/CreateDonationService'

import { ensureDonor } from '@middlewares/ensureDonor'
import { ensureAuthenticateDonor } from '@middlewares/ensureAuthenticateDonor'
import { ServiceDependencies } from '@services/BaseService'

export class CreateDonationController
extends BaseController {
  protected readonly group: string = '/donations'
  protected readonly path: string = '/'
  protected readonly method: string = 'POST'

  public constructor(
    logger: Logger,
    routes: IRouter,
    connectionAdapter: ConnectionPlugin
  ) {
    super(logger, routes, connectionAdapter)
    this.setMiddlewares([
      ensureAuthenticateDonor,
      ensureDonor
    ])
    this.subscribe({
      group: this.group,
      path: this.path,
      method: this.method,
      handler: this.handle.bind(this)
    })
  }

  public async handle(request: Request, response: Response): Promise<Response> {
    const { donor_id: donorId } = request

    this.endpointAccessLog(
      this.method,
      this.group.concat('', this.path),
      donorId
    )

    const { incident_id: incidentId, amount } = request.body

    const service = new CreateDonationService(this.dependencies())

    const donate = await service.execute({
      incidentId,
      donorId,
      amount
    })

    return response.status(201).json(donate)
  }

  public dependencies(): ServiceDependencies {
    const connection = this.connectionPlugin.connect()
    const dependencies: ServiceDependencies = {
      providers: {
        stripe: new StripeProvider()
      },
      repositories: {
        users: connection.getCustomRepository(UsersRepository),
        incidents: connection.getCustomRepository(IncidentsRepository),
        donations: connection.getCustomRepository(DonationsRepository)
      }
    }
    return dependencies
  }
}
