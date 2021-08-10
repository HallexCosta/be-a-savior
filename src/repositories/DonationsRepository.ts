import { EntityRepository, Repository } from 'typeorm'

import { Donation } from '@entities'

@EntityRepository(Donation)
export class DonationsRepository extends Repository<Donation> {
  public async findAll(): Promise<Donation[]> {
    return await this.find()
  }

  public async findById(id: string): Promise<Donation> {
    return await this.findOne({ id })
  }
}
