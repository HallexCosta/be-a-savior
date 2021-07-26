import { Request, Response } from 'express'
import { ListIncidentsService } from '@services'

export class ListIncidentsController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const service = new ListIncidentsService()

    const incidents = await service.execute()

    return response.json(incidents)
  }
}
