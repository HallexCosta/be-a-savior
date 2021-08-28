import { DeleteResult, EntityRepository, Repository } from 'typeorm'

import { Incident } from '@entities/Incident'

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
}
