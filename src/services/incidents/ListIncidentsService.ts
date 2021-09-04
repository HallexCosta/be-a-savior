import { getCustomRepository } from 'typeorm'

import { Incident } from '@entities/Incident'

import { IncidentsRepository } from '@repositories/IncidentsRepository'

type ListIncidentsDTO = {
  ongId?: string
  donated?: boolean
}

export class ListIncidentsService {
  public async execute({
    ongId,
    donated
  }: ListIncidentsDTO): Promise<Incident[]> {
    const repository = getCustomRepository(IncidentsRepository)

    let incidents = await repository.findAll()

    if (ongId) {
      incidents = this.filterByOngId(incidents, ongId)
    }

    if (donated === true) {
      incidents = this.filterDonated(incidents)
    }

    if (donated === false) {
      incidents = this.filterNonDonated(incidents)
    }

    return incidents
  }

  private filterByOngId(incidents: Incident[], ongId: string) {
    return incidents.filter(incident => incident.ong_id === ongId)
  }

  private filterDonated(incidents: Incident[]) {
    return incidents.filter(incident => incident.donation_id !== null)
  }

  private filterNonDonated(incidents: Incident[]) {
    return incidents.filter(incident => incident.donation_id === null)
  }
}
