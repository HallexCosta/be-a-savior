import { Donor } from '@entities/Donor'
import { Donation } from '@entities/Donation'

import { StripeProvider } from '@providers/StripeProvider'

import BaseService, { ServiceDependencies } from '@services/BaseService'

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

export class CreateDonationService extends BaseService {
  public constructor({ repositories, providers }: ServiceDependencies) {
    super(repositories, providers)
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

    const incidentsRepository = this.repositories.incidents

    const incident = await incidentsRepository.findById(incidentId)

    if (!incident) {
      throw new Error('Incident not exists')
    }

    this.checkDonationAmountIsGreaterThanIncidentCost(
      amount,
      incident.cost
    )

    const donationsAmount = incident.donations.map(
      (donation) => donation.amount
    )

    const totalDonationsAmount =
      this.calculateTotalDonationsAmount(donationsAmount)

    this.checkIncidentReachedLimitDonation(incident.cost, totalDonationsAmount)

    const usersRepository = this.repositories.users
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

    const donationsRepository = this.repositories.donations

    const donation = donationsRepository.create({
      incident_id: incident.id,
      user_id: donor.id,
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

  private checkDonationAmountIsGreaterThanIncidentCost(
    donationAmount: number,
    incidentCost: number
  ) {
    if (donationAmount > incidentCost)
      throw new Error(
        'Ops... the donation has an amount greater than the incident cost'
      )
  }

  private checkIncidentReachedLimitDonation(
    incidentCost: number,
    totalDonationsAmount: number
  ): void {
    const isReachedLimit = totalDonationsAmount >= incidentCost

    if (isReachedLimit)
      throw new Error('Ops... this incident already reached limit of donations')
  }

  private calculateTotalDonationsAmount(donationsAmount: number[]) {
    return donationsAmount.reduce((prev, curr) => prev + curr, 0)
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
