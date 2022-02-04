import { getCustomRepository } from 'typeorm'
import { Request, Response } from 'express'

import { ListIncidentsService } from '@services/incidents/ListIncidentsService'

import { UsersRepository } from '@repositories/UsersRepository'

type QueryParams = {
  ongId?: string
  donated?: boolean
}

export class ListIncidentsController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const { ongId, donated } = this.queryParams(request.query)

    const service = new ListIncidentsService(
      this.listIncidentsServiceDependencies()
    )

    const parsedDonated = donated ?? null
    const parsedOngId = ongId ?? null

    const { incidents, totalIncidentsAndDonations } = await service.execute({
      ongId: parsedOngId,
      donated: parsedDonated
    })

    response.setHeader('X-TOTAL', JSON.stringify(totalIncidentsAndDonations))

    return response.json(incidents)
  }

  private queryParams(params: any): QueryParams {
    const queryParams = {} as QueryParams

    queryParams.donated = params.donated === 'true'
    queryParams.ongId = params.ong_id

    if (!params.donated) {
      queryParams.donated = undefined
    }

    return queryParams
  }

  public listIncidentsServiceDependencies() {
    return {
      repositories: {
        users: getCustomRepository(UsersRepository)
      }
    }
  }
}
