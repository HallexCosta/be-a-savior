import { IRouter, Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'

import { Logger } from '@common/logger'

import BaseController from '@controllers/BaseController'
import { 
  DeleteIncidentService,
  DeleteIncidentDependencies
} from '@services/incidents/DeleteIncidentService'

import { IncidentsRepository } from '@repositories/IncidentsRepository'

import { ensureAuthenticateOng } from '@middlewares/ensureAuthenticateOng'
import { ensureOng } from '@middlewares/ensureOng'

export default class DeleteIncidentController
extends BaseController {
  protected readonly group: string = '/incidents'  
  protected readonly path: string = '/:id'  
  protected readonly method: string = 'DELETE'

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

    const service = new DeleteIncidentService(
      this.deleteIncidentDependencies()
    )

    const incident = await service.execute({ id, ongId })

    return response.json(incident)
  }

  public deleteIncidentDependencies(): DeleteIncidentDependencies {
    return {
      repositories: {
        incidents: getCustomRepository(IncidentsRepository)
      }
    }
  }
}
