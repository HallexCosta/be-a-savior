import { Request, Response, IRouter } from 'express'

import { Logger } from '@common/logger'

import BaseController from '@controllers/BaseController'

import { ListDonationsService } from '@services/donations/ListDonationsService'
import { ConnectionPlugin } from '@database/ConnectionAdapter'
import { DonationsRepository } from '@repositories/DonationsRepository'
import { ServiceDependencies } from '@services/BaseService'

export class ListDonationsController
extends BaseController {
  protected readonly group: string = '/donations'
  protected readonly path: string = '/'
  protected readonly method: string = 'GET'

  public constructor(
    logger: Logger,
    routes: IRouter,
    connectionAdapter: ConnectionPlugin
  ) {
    super(logger, routes, connectionAdapter)
    this.subscribe({
      path: this.path,
      method: this.method,
      handler: this.handle.bind(this)
    })
  }
  public async handle(request: Request, response: Response): Promise<Response> {
    const donorId = request.query.ong_id as string

    this.endpointAccessLog(
      this.method,
      this.path,
      'guest'
    )

    const service = new ListDonationsService(
      this.listDonationsServiceDependencies()
    )

    const incident = await service.execute({
      donorId
    })

    return response.json(incident)
  }

  public listDonationsServiceDependencies(): ServiceDependencies {
    const connection = this.connectionPlugin.connect()
    return {
      repositories: {
        donations: connection.getCustomRepository(DonationsRepository),
      }
    }
  }
}
