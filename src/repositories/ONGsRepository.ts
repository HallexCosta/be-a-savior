import { EntityRepository, Repository } from 'typeorm'

import { ONG } from '@entities'

@EntityRepository(ONG)
export class ONGsRepository extends Repository<ONG> {}
