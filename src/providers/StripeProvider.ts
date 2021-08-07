import { Stripe } from 'stripe'

import { configs } from '@common'

export class StripeProvider {
  public readonly customers: Stripe.CustomersResource
  public readonly paymentIntents: Stripe.PaymentIntentsResource

  public constructor() {
    const apiVersion = configs.stripe.API_VERSION as '2020-08-27'

    Object.assign(
      new Stripe(configs.stripe.SECRET_API_KEY, {
        apiVersion
      }),
      this
    )
  }

  public async findPaymentByIncidentId(
    incident_id: string
  ): Promise<Stripe.PaymentIntent> {
    const paymentIntents = await this.paymentIntents.list()

    const paymentIntent = paymentIntents.data.find(
      paymentIntent => incident_id === paymentIntent.metadata.incident_id
    )

    return paymentIntent
  }
}
