import { StripeProvider } from '@providers/StripeProvider'
import { DonationsRepository } from '@repositories/DonationsRepository'
import { IncidentsRepository } from '@repositories/IncidentsRepository'
import { UsersRepository } from '@repositories/UsersRepository'

type ServiceRepositories = {
  incidents?: IncidentsRepository
  users?: UsersRepository
  donations?: DonationsRepository
}

type ServiceProviders = {
  stripe?: StripeProvider
}

export type ServiceDependencies = {
  repositories?: ServiceRepositories
  providers?: ServiceProviders
}

export interface BaseServiceMethods { }

export default abstract class BaseService implements BaseServiceMethods {
  protected readonly repositories: ServiceRepositories = Object.create({})
  protected readonly providers: ServiceProviders = Object.create({})

  public constructor(
    serviceRepositories?: Partial<ServiceRepositories>,
    serviceProviders?: Partial<ServiceProviders>
  ) {
    Object.assign(this.repositories, serviceRepositories || {})
    Object.assign(this.providers, serviceProviders || {})
  }
}
