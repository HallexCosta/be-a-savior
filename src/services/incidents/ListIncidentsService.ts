import { Incident } from '@entities/Incident'

import Util from '@common/util'

import { IncidentsRepository } from '@repositories/IncidentsRepository'
import BaseService, { ServiceDependencies } from '@services/BaseService'

export type ListIncidentsDTO = {
  ongId?: string
  donorId?: string
  donated?: 'complete' | 'incomplete' | 'none'
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
    donorId,
    donated
  }: ListIncidentsDTO): Promise<ListIncidentsResponse> {
    const incidentsRepository = this.repositories.incidents

    const incidents = await incidentsRepository.findIncidentsByFilter({
      donated,
      donorId,
      ongId
    })

    const totalIncidentsAndDonations =
      this.totalIncidentsAndDonations(incidents)

    return {
      incidents: Util.classesToClasses<Incident>(incidents),
      totalIncidentsAndDonations
    }
  }

  public totalIncidentsAndDonations(
    incidents: Incident[]
  ): TotalIncidentsAndDonations {
    const totalIncidents = incidents.length
    const totalDonations = incidents
      .map((incident) => incident.donations.length)
      .reduce((curr, prev) => prev + curr, 0)

    const totalIncidentsDonated = incidents
      .map((incident) => (incident.donations.length > 0 ? 1 : 0))
      .reduce((curr: number, prev: number) => prev + curr, 0)

    const totalIncidentsNonDonated = incidents
      .map((incident) => (incident.donations.length <= 0 ? 1 : 0))
      .reduce((curr: number, prev: number) => prev + curr, 0)

    return {
      totalIncidents,
      totalDonations,
      totalIncidentsDonated,
      totalIncidentsNonDonated
    }
  }
}
