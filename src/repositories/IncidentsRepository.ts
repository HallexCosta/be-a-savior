import {
  DeleteResult,
  EntityRepository,
  Repository,
  SelectQueryBuilder
} from 'typeorm'

import { Incident } from '@entities/Incident'

type FindIncidentsFilter = {
  ongId: string
  donated: boolean | 'all'
}

interface IncidentsRepositoryMethods {
  findAll(): Promise<Incident[]>
  findByOngId(ongId: string): Promise<Incident[]>
  findIncidentsByFilter(filter: FindIncidentsFilter): Promise<Incident[]>
  findById(id: string): Promise<Incident>
  deleteById(id: string): Promise<DeleteResult>
}

@EntityRepository(Incident)
export class IncidentsRepository extends Repository<Incident> implements IncidentsRepositoryMethods {
  async findAll(): Promise<Incident[]> {
    return await this.find({
      relations: ['donations', 'donations.donor'],
    })
  }

  async findByOngId(ongId: string): Promise<Incident[]> {
    return await this.find({
      where: {
        ongId
      }
    })
  }

  async findIncidentsByFilter({ ongId = null, donated = 'all' }: FindIncidentsFilter): Promise<Incident[]> {
    return await this.find({
      where: (queryBuilder: SelectQueryBuilder<Incident>) => {
        if (ongId) {
          const onlyOng = `Incident.user_id = :ongId`
          queryBuilder
            .where(onlyOng, { ongId })
        }

        if (donated !== null) {
          const onlyDonated = `Incident__donations.incident_id is ${donated ? 'not' : ''} null`
          queryBuilder
            .andWhere(onlyDonated)
        }
      },
      relations: ['donations', 'donations.donor']
    })
  }

  async findById(id: string): Promise<Incident> {
    return await this.findOne({
      where: {
        id
      },
      relations: ['donations', 'donations.donor']
    })
  }

  async deleteById(id: string): Promise<DeleteResult> {
    return await this.delete({
      id
    })
  }
}
