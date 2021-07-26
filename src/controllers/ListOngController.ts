import { Request, Response } from 'express'

import { ListOngService } from '@services'

export class ListOngController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params

    const service = new ListOngService()

    const ong = await service.execute({ id })

    return response.json(ong)
  }
}
