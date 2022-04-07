import { IRouter,Request, Response } from 'express'

import { Logger } from '@common/logger'
import BaseController from '@controllers/BaseController'
import { UpdateIncidentService } from '@services/incidents/UpdateIncidentService'

import { ensureAuthenticateOng } from '@middlewares/ensureAuthenticateOng'
import { ensureOng } from '@middlewares/ensureOng'

export class UpdateIncidentController
extends BaseController {
  protected readonly group: string = '/incidents'  
  protected readonly path: string = '/:id'  
  protected readonly method: string = 'PATCH'

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
    const { ong_id: ongId } = request

    this.endpointAccessLog(
      this.method,
      this.group.concat('', this.path),
      ongId
    )

    const { id } = request.params

    const { name, cost, description } = request.body

    const service = new UpdateIncidentService()

    const incident = await service.execute({
      id,
      name,
      cost,
      description,
      ongId
    })

    return response.json(incident)
  }
}
