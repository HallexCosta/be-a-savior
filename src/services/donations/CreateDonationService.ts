import { getCustomRepository } from 'typeorm'

import { Donor } from '@entities/Donor'
import { Donation } from '@entities/Donation'

import { UsersRepository } from '@repositories/UsersRepository'
import { IncidentsRepository } from '@repositories/IncidentsRepository'
import { DonationsRepository } from '@repositories/DonationsRepository'

import { StripeProvider, PaymentIntentCreateParams } from '@providers/StripeProvider'

import { configs } from '@common/configs'

type CreateDonationDTO = {
  incidentId: string
  donorId: string
  amount: number
}

type Providers = {
  stripe: StripeProvider
}

export type CreateDonationDependencies = {
  providers: Providers
}

export class CreateDonationService {
  private providers: Providers

  public constructor(deps: CreateDonationDependencies) {
    Object.assign(this, deps)
  }

  public async execute({
    incidentId,
    donorId,
    amount
  }: CreateDonationDTO): Promise<Donation> {
    this.checkForFieldIsFilled({
      incidentId,
      donorId,
      amount
    })

    const incidentsRepository = getCustomRepository(IncidentsRepository)

    const incident = await incidentsRepository.findById(incidentId)

    if (!incident) {
      throw new Error('Incident not exists')
    }

    const usersRepository = getCustomRepository(UsersRepository)
    const donor = await usersRepository.findById(donorId)

    //const {
    //  data: [customer]
    //} = await this.providers.stripe.customers.list({
    //  email: donor.email
    //})

    //const paymentMethod = await this.providers.stripe.paymentMethods.create({
    //  type: 'card',
    //  card: { token: 'tok_mastercard' }
    //})

    //await this.providers.stripe.paymentMethods.attach(paymentMethod.id, {
    //  customer: customer.id
    //})

    const donationsRepository = getCustomRepository(DonationsRepository)

    const donation = donationsRepository.create({
      incident_id: incident.id,
      user_id: donorId,
      amount
    })

    //const amount = this.parseCoastToAmount(incident.cost)

    //const paymentIntent: PaymentIntentCreateParams = {
    //  amount,
    //  currency: 'brl',
    //  payment_method_types: ['card'],
    //  payment_method: paymentMethod.id,
    //  customer: customer.id,
    //  receipt_email: donor.email,
    //  metadata: {
    //    donation_id: donation.id
    //  }
    //}

    //if (configs.modes.test) {
    //  paymentIntent.confirm = true
    //}

    //await this.providers.stripe.paymentIntents.create(paymentIntent)

    await donationsRepository.save(donation)

    return donation
  }

  private paymentIncident(ongId: string, donor: Donor) {
    // ...
  }

  private parseCoastToAmount(cost: number) {
    const amount = cost * 100

    return amount
  }

  private checkForFieldIsFilled({
    incidentId,
    donorId,
    amount
  }: CreateDonationDTO): void {
    console.log('queryparam', incidentId)
    if (!incidentId) {
      throw new Error("Incident id can't empty")
    }

    if (!donorId) {
      throw new Error("Donor id can't empty")
    }

    if (!amount) {
      throw new Error("Amount can't empty")
    }
  }
}
