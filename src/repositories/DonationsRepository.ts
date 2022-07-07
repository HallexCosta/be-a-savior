import { EntityRepository, Repository } from 'typeorm'

import { Donation } from '@entities/Donation'

@EntityRepository(Donation)
export class DonationsRepository extends Repository<Donation> {
  public async findAll(): Promise<Donation[]> {
    return await this.find({
      relations: ['donor']
    })
  }

  public async findById(id: string): Promise<Donation> {
    return await this.findOne({ id })
  }

  public async findByIncidentId(incident_id: string): Promise<Donation> {
    return await this.findOne({ incident_id })
  }

  public async findByDonorId(donorId: string): Promise<Donation[]> {
    return await this.find({
      where: {
        user_id: donorId
      },
      relations: ['donor']
    })
  }
}
