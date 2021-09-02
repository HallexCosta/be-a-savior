import { EntityRepository, Repository } from 'typeorm'

import { Donation } from '@entities/Donation'

@EntityRepository(Donation)
export class DonationsRepository extends Repository<Donation> {
  public async findAll(): Promise<Donation[]> {
    return await this.find()
  }

  public async findById(id: string): Promise<Donation> {
    return await this.findOne({ id })
  }

  public async findByIncidentId(incident_id: string): Promise<Donation> {
    return await this.findOne({ incident_id })
  }

  public async findByOngId(ong_id: string): Promise<Donation[]> {
    const donations = await this.find({
      ong_id
    })

    return donations
  }
}
