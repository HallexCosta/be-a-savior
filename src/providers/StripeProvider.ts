import Stripe from 'stripe'

import { configs } from '@common/config'

export class StripeProvider extends Stripe {
  public constructor() {
    super(configs.stripe.SECRET_API_KEY, {
      apiVersion: configs.stripe.API_VERSION
    })
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
