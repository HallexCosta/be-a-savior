import { IRouter, Request, Response } from 'express'

import { Logger } from '@common/logger'
import BaseController from '@controllers/BaseController'
import { ListIncidentsService } from '@services/incidents/ListIncidentsService'

import { ConnectionPlugin } from '@database/ConnectionAdapter'
import { IncidentsRepository } from '@repositories/IncidentsRepository'

type QueryParams = {
  donorId?: string
  ongId?: string
  donated?: 'complete' | 'incomplete' | 'none'
}

export class ListIncidentsController extends BaseController {
  protected readonly group: string = '/incidents'
  protected readonly path: string = '/'
  protected readonly method: string = 'GET'

  public constructor(
    logger: Logger,
    routes: IRouter,
    connectionAdapter: ConnectionPlugin
  ) {
    super(logger, routes, connectionAdapter)
    this.subscribe({
      group: this.group,
      path: this.path,
      method: this.method,
      handler: this.handle.bind(this)
    })
  }

  public async handle(request: Request, response: Response): Promise<Response> {
    const { donorId, ongId, donated } = request.query as QueryParams

    const service = new ListIncidentsService(
      this.listIncidentsServiceDependencies()
    )

    const parsedDonated = donated ?? null
    const parsedOngId = ongId ?? null
    const parsedDonorId = donorId ?? null

    const { incidents, totalIncidentsAndDonations } = await service.execute({
      ongId: parsedOngId,
      donorId: parsedDonorId,
      donated: parsedDonated
    })

    response.setHeader('X-TOTAL', JSON.stringify(totalIncidentsAndDonations))

    return response.json(incidents)
  }

  public listIncidentsServiceDependencies() {
    const connection = this.connectionPlugin.connect()
    return {
      repositories: {
        incidents: connection.getCustomRepository(IncidentsRepository)
      }
    }
  }
}
