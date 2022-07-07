import { Donation } from '@entities/Donation'

import { Util } from '@common/util'
import BaseService, { ServiceDependencies } from '@services/BaseService'

type ListDonationsDTO = {
  donorId?: string
}

export class ListDonationsService extends BaseService {
  public constructor({ repositories, providers }: ServiceDependencies) {
    super(repositories, providers)
  }

  public async execute({ donorId }: ListDonationsDTO): Promise<Donation[]> {
    const repository = this.repositories.donations

    if (Util.isUUID(donorId)) {
      const donations = await repository.findByDonorId(donorId)
      return Util.classesToClasses<Donation>(donations)
    }
    const donations = await repository.findAll() || []
    return Util.classesToClasses<Donation>(donations)
  }
}
