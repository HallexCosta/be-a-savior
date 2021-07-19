import { EntityRepository, Repository } from 'typeorm'

import { Incident } from '@entities'

@EntityRepository(Incident)
export class IncidentsRepository extends Repository<Incident> {}
