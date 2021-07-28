import { Request, Response } from 'express'
import { ListIncidentsService } from '@services'

export class ListIncidentsController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const ong_id = request.query.ong_id as string

    const service = new ListIncidentsService()

    const incidents = await service.execute({
      ong_id
    })

    return response.json(incidents)
  }
}
