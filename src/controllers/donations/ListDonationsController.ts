import { Request, Response, IRouter } from 'express'

import { Logger } from '@common/logger'

import BaseController from '@controllers/BaseController'

import { ListDonationsService } from '@services/donations/ListDonationsService'

export class ListDonationsController
extends BaseController {
  protected readonly group: string = '/donations'
  protected readonly path: string = '/'
  protected readonly method: string = 'GET'

  public constructor(
    logger: Logger,
    routes: IRouter
  ) {
    super(logger, routes)
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

    const service = new ListDonationsService()

    const incident = await service.execute({
      donorId
    })

    return response.json(incident)
  }
}
