import { EntityRepository, Repository } from 'typeorm'

import { Donor } from '@entities'

@EntityRepository(Donor)
export class DonorsRepository extends Repository<Donor> {}
