import {
  DeleteResult,
  EntityRepository,
  Repository,
  UpdateResult
} from 'typeorm'

import { Incident } from '@entities/Incident'

type UpdateDonationIdByIncidentIdParams = {
  incident_id: string
  donation_id: string
}

@EntityRepository(Incident)
export class IncidentsRepository extends Repository<Incident> {
  async findById(id: string): Promise<Incident> {
    return await this.findOne({
      id
    })
  }

  async findByOngId(ong_id: string): Promise<Incident[]> {
    return await this.find({
      ong_id
    })
  }

  async deleteById(id: string): Promise<DeleteResult> {
    return await this.delete({
      id
    })
  }

  async updateDonationIdByIncidentId({
    incident_id,
    donation_id
  }: UpdateDonationIdByIncidentIdParams): Promise<UpdateResult> {
    return await this.update(incident_id, {
      donation_id
    })
  }
}
