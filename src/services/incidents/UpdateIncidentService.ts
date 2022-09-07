import BaseService, {
  BaseServiceMethods,
  ServiceDependencies
} from '@services/BaseService'

import { Donation } from '@entities/Donation'
import { Incident } from '@entities/Incident'

export declare type UpdateIncidentDTO = {
  id: string
  name: string
  cost: number
  description: string
  ongId: string
}

declare interface UpdateIncidentServiceMethods extends BaseServiceMethods {
  /* Prevent ong to update incident cost if reached max limit of donatios
   * @params incident Receive the incident entity
   * @return void
   */
  preventUpdateIncidentCost(
    incidentCostUpdated: number,
    donations: Donation[]
  ): void
}

class PreventUpdateIncidentCostError extends Error {
  public constructor(incidentCost: number, totalDonations: number) {
    super(
      `Opss... can't possible update incident cost because the incident cost "${incidentCost}" is less than total donations "${totalDonations}"`
    )
  }
}

export class UpdateIncidentService
  extends BaseService
  implements UpdateIncidentServiceMethods
{
  public constructor({ repositories, providers }: ServiceDependencies) {
    super(repositories, providers)
  }

  public async execute({
    id,
    name,
    cost,
    description,
    ongId
  }: UpdateIncidentDTO): Promise<Incident> {
    const incidentsRepository = this.repositories.incidents

    const incidentAlreadyExists = await incidentsRepository.findById(id)

    this.checkIncidentExists(incidentAlreadyExists)

    this.checkIncidentBelongsThisOng(ongId, incidentAlreadyExists.user_id)

    this.preventUpdateIncidentCost(cost, incidentAlreadyExists.donations)

    const incident = incidentsRepository.create({
      ...incidentAlreadyExists,
      name,
      cost,
      description
    })

    const { donations, ...incidentUpdated } = incident

    await incidentsRepository.update(
      {
        id
      },
      incidentUpdated
    )

    return incident
  }

  private checkIncidentBelongsThisOng(
    ongId: string,
    ongIdFromIncident: string
  ) {
    if (ongId !== ongIdFromIncident) {
      throw new Error('This incident not belong this ong')
    }
  }

  private checkIncidentExists(incident: Incident): void {
    if (!incident) {
      throw new Error('Incident not exists')
    }
  }

  public preventUpdateIncidentCost(
    incidentCostUpdated: number,
    donations: Donation[]
  ): void {
    const totalDonations = donations.reduce(
      (prev, curr) => prev + curr.amount,
      0
    )

    if (incidentCostUpdated < totalDonations) {
      throw new PreventUpdateIncidentCostError(
        incidentCostUpdated,
        totalDonations
      )
    }
  }
}
