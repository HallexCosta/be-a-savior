import { getCustomRepository } from 'typeorm'

import { Incident } from '@entities/Incident'

import { IncidentsRepository } from '@repositories/IncidentsRepository'
import { UsersRepository } from '@repositories/UsersRepository'

type ListIncidentsDTO = {
  ongId?: string
  donated?: boolean
}

type Repositories = {
  users: UsersRepository
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

export class ListIncidentsService {
  public readonly repositories: Repositories

  public constructor(listIncidentsDependencies: ListIncidentsDependencies) {
    Object.assign(this, listIncidentsDependencies)
  }

  public async execute({
    ongId,
    donated
  }: ListIncidentsDTO): Promise<ListIncidentsResponse> {
    const incidentsRepository = getCustomRepository(IncidentsRepository)

    const incidents = await incidentsRepository.findIncidentsByFilter({
      donated,
      ongId
    })

    const totalIncidentsAndDonations = this.totalIncidentsAndDonations(incidents)

    return {
      incidents,
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
