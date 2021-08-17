import { EntityRepository, Repository } from 'typeorm'

import { Ong } from '@entities/Ong'

@EntityRepository(Ong)
export class OngsRepository extends Repository<Ong> {
  async findByEmail(email: string): Promise<Ong> {
    return await this.findOne({
      email
    })
  }

  async findById(id: string): Promise<Ong> {
    return await this.findOne({
      id
    })
  }
}
