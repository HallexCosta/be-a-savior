import { Incident } from '@entities/Incident'
import BaseService, { ServiceDependencies } from '@services/BaseService'

type ListIncidentDTO = {
  id: string
}

export class ListIncidentService extends BaseService {
  public constructor({ repositories, providers }: ServiceDependencies) {
    super(repositories, providers)
  }

  public async execute({ id }: ListIncidentDTO): Promise<Incident> {
    const incidentsRepository = this.repositories.incidents

    const incident = await incidentsRepository.findById(id)

    return incident
  }
}
