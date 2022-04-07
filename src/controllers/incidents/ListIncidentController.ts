import { IRouter, Request, Response } from 'express'

import { Logger } from '@common/logger'
import BaseController from '@controllers/BaseController'
import { ListIncidentService } from '@services/incidents/ListIncidentService'

import { ensureAuthenticateOng } from '@middlewares/ensureAuthenticateOng'
import { ensureOng } from '@middlewares/ensureOng'

export class ListIncidentController
extends BaseController {
  protected readonly group: string = '/incidents'  
  protected readonly path: string = '/:id'  
  protected readonly method: string = 'GET'

  public constructor(
    logger: Logger,
    routes: IRouter
  ) {
   super(logger, routes)
   this.setMiddlewares([
      ensureAuthenticateOng,
      ensureOng
   ])
   this.subscribe({
     group: this.group,
     path: this.path,
     method: this.method,
     handler: this.handle.bind(this)
   })
  }

  public async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params

    this.endpointAccessLog(
      this.method,
      this.group.concat('', this.path),
      id
    )

    const service = new ListIncidentService()

    const incident = await service.execute({ id })

    return response.json(incident)
  }
}
