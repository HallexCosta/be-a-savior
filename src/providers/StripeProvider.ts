import { Stripe } from 'stripe'

import { stripe as stripeConfig } from '@common/configs/stripe'

export class StripeProvider {
  public readonly customers: Stripe.CustomersResource
  public readonly paymentIntents: Stripe.PaymentIntentsResource

  public constructor() {
    const apiVersion = stripeConfig.API_VERSION as '2020-08-27'

    const stripe = new Stripe(stripeConfig.SECRET_API_KEY, {
      apiVersion
    })

    Object.assign(this, stripe)
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
