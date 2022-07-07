import { classToClass } from 'class-transformer'

import { Donation } from '@entities/Donation'
import { Incident } from '@entities/Incident'

import { Util } from '@common/util'

import { IncidentsRepository } from '@repositories/IncidentsRepository'
import BaseService, { ServiceDependencies } from '@services/BaseService'

type ListIncidentsDTO = {
  ongId?: string
  donated?: boolean
}

type Repositories = {
  incidents: IncidentsRepository
}

export type ListIncidentsDependencies = {
  repositories: Repositories
}

type TotalIncidentsAndDonations = {
  totalIncidents: number
  totalDonations: number
  totalIncidentsDonated: number
  totalIncidentsNonDonated: number
}

type ListIncidentsResponse = {
  totalIncidentsAndDonations: TotalIncidentsAndDonations
  incidents: Incident[]
}

export class ListIncidentsService extends BaseService {
  public constructor({ repositories, providers }: ServiceDependencies) {
    super(repositories, providers)
  }

  public async execute({
    ongId,
    donated
  }: ListIncidentsDTO): Promise<ListIncidentsResponse> {
    const incidentsRepository = this.repositories.incidents

    const incidents = await incidentsRepository.findIncidentsByFilter({
      donated,
      ongId
    })

    const totalIncidentsAndDonations = this.totalIncidentsAndDonations(incidents)

    return {
      incidents: Util.classesToClasses<Incident>(incidents),
      totalIncidentsAndDonations
    }
  }

  public totalIncidentsAndDonations(incidents: Incident[]): TotalIncidentsAndDonations {
    const totalIncidents = incidents.length
    const totalDonations = incidents
      .map(incident => incident.donations.length)
      .reduce((curr, prev) => prev + curr, 0)

    const totalIncidentsDonated = incidents
      .map(incident => incident.donations.length > 0 ? 1 : 0)
      .reduce((curr: number, prev: number) => prev + curr, 0)

    const totalIncidentsNonDonated = incidents
      .map(incident => incident.donations.length <= 0 ? 1 : 0)
      .reduce((curr: number, prev: number) => prev + curr, 0)

    return {
      totalIncidents,
      totalDonations,
      totalIncidentsDonated,
      totalIncidentsNonDonated
    }
  }
}
