import { ListDonorsService } from '@services'
import { Request, Response } from 'express'

export class ListDonorsController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const service = new ListDonorsService()

    const donors = await service.execute()

    return response.json(donors)
  }
}
