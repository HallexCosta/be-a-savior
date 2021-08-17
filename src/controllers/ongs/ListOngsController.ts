import { Request, Response } from 'express'

import { ListOngsService } from '@services/ongs/ListOngsService'

export class ListOngsController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const service = new ListOngsService()

    const ongs = await service.execute()

    return response.json(ongs)
  }
}
