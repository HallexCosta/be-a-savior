import { EntityRepository, Repository } from 'typeorm'

import { Donor } from '@entities'

@EntityRepository(Donor)
export class DonorsRepository extends Repository<Donor> {
  async findByEmail(email: string): Promise<Donor> {
    return await this.findOne({
      email
    })
  }
}
