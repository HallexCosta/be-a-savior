import { EntityRepository, Repository } from 'typeorm'

import { Ong } from '@entities'

@EntityRepository(Ong)
export class OngsRepository extends Repository<Ong> {}
