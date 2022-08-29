import {
  DeleteResult,
  EntityRepository,
  Repository,
  SelectQueryBuilder
} from 'typeorm'

import Util from '@common/util'

import { Incident } from '@entities/Incident'

type FindIncidentsFilter = {
  ongId: string | null
  donorId: string | null
  donated: 'complete' | 'incomplete' | 'none' | null
}

interface IncidentsRepositoryMethods {
  findAll(): Promise<Incident[]>
  findByOngId(ongId: string): Promise<Incident[]>
  findIncidentsByFilter(filter: FindIncidentsFilter): Promise<Incident[]>
  findById(id: string): Promise<Incident>
  deleteById(id: string): Promise<DeleteResult>
}

@EntityRepository(Incident)
export class IncidentsRepository
  extends Repository<Incident>
  implements IncidentsRepositoryMethods
{
  async findAll(): Promise<Incident[]> {
    return await this.find({
      relations: ['donations', 'donations.donor']
    })
  }

  async findByOngId(ongId: string): Promise<Incident[]> {
    return await this.find({
      where: {
        ongId
      }
    })
  }

  async findIncidentsByFilter({
    ongId,
    donorId,
    donated
  }: FindIncidentsFilter): Promise<Incident[]> {
    return await this.find({
      where: (queryBuilder: SelectQueryBuilder<Incident>) => {
        if (ongId) {
          const onlyOng = 'Incident.user_id = :ongId'
          queryBuilder.where(onlyOng, { ongId })
        }

        if (donorId) {
          const onlyDonor = 'Incident__donations.user_id = :donorId'
          queryBuilder.where(onlyDonor, { donorId })
        }

        Util.switch({
          entry: donated,
          cases: {
            complete() {
              queryBuilder
                .groupBy(
                  'Incident.id, Incident__donations.id,  Incident__donations__donor.id'
                )
                .having('sum(Incident__donations.amount) = Incident.cost')
            },
            incomplete() {
              queryBuilder.andWhere(
                'Incident__donations.incident_id is not null'
              )
            },
            none() {
              queryBuilder.andWhere('Incident__donations.incident_id is null')
            }
          }
        })
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
