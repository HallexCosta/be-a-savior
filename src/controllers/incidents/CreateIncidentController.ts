import { IRouter, Request, Response } from 'express'

import BaseController from '@controllers/BaseController'
import { Logger } from '@common/logger'
import { CreateIncidentService } from '@services/incidents/CreateIncidentService'

import { ensureAuthenticateOng } from '@middlewares/ensureAuthenticateOng'
import { ensureOng } from '@middlewares/ensureOng'

export class CreateIncidentController 
extends BaseController {
  protected readonly group: string = '/ongs'  
  protected readonly path: string = '/'  
  protected readonly method: string = 'POST'

  public constructor(
    logger: Logger,
    routes: IRouter
  ) {
   super(logger, routes)
   this.setMiddlewares([
     ensureAuthenticateOng,
     ensureOng,
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

    const { name, cost, description } = request.body

    const service = new CreateIncidentService()

    const incident = await service.execute({
      name,
      cost,
      description,
      ongId
    })

    return response.status(201).json(incident)
  }
}
