import Stripe from 'stripe'

import { getCustomRepository } from 'typeorm'

import { Donation } from '@entities/Donation'

import { IncidentsRepository } from '@repositories/IncidentsRepository'
import { DonorsRepository } from '@repositories/DonorsRepository'

import { DonationsRepository } from '@repositories/DonationsRepository'

import { StripeProvider } from '@providers/StripeProvider'
import { OngsRepository } from '@repositories/OngsRepository'

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
    const donationsRepository = getCustomRepository(DonationsRepository)

    const donation = donationsRepository.create({
      incident_id: incidentId,
      donor_id: donorId
    })

    const donationAlreadyExists = await donationsRepository.findByIncidentId(
      donation.incident_id
    )

    if (donationAlreadyExists) {
      throw new Error('Already was accomplish a donation to this incident')
    }

    const incidentsRepository = getCustomRepository(IncidentsRepository)

    const incident = await incidentsRepository.findById(incidentId)

    if (!incident) {
      throw new Error('Incident not exists')
    }

    const donorsRepository = getCustomRepository(DonorsRepository)

    const donor = await donorsRepository.findById(donorId)

    if (!donor) {
      throw new Error('Donor not exists')
    }

    const ongsRepository = getCustomRepository(OngsRepository)

    const { email } = await ongsRepository.findById(incident.ong_id)

    const {
      data: [customer]
    } = await this.providers.stripe.customers.list({
      email
    })

    const paymentMethod = await this.providers.stripe.paymentMethods.create({
      type: 'card',
      card: { token: 'tok_mastercard' }
    })

    await this.providers.stripe.paymentMethods.attach(paymentMethod.id, {
      customer: customer.id
    })

    const paymentIntent: Stripe.PaymentIntentCreateParams = {
      amount,
      currency: 'brl',
      payment_method_types: ['card'],
      payment_method: paymentMethod.id,
      customer: customer.id,
      receipt_email: donor.email,
      metadata: {
        donation_id: donation.id
      }
    }

    if (configs.modes.test) {
      paymentIntent.confirm = true
    }

    await this.providers.stripe.paymentIntents.create(paymentIntent)

    await donationsRepository.save(donation)

    return donation
  }

  private checkForFieldIsFilled({
    incidentId,
    donorId,
    amount
  }: CreateDonationDTO): void {
    if (!incidentId) {
      throw new Error("Incident can't empty")
    }

    if (!donorId) {
      throw new Error("Donor can't empty")
    }

    if (!amount) {
      throw new Error("Amount can't empty")
    }
  }
}
