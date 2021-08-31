import faker from 'faker'
import assert from 'assert'
import { expect } from 'chai'

import { StripeProvider } from '../../../src/providers/StripeProvider'

faker.locale = 'pt_BR'

const stripe = new StripeProvider()

describe('Stripe Provider', () => {
  function log(msg, object) {
    console.log('\n')
    console.log(msg)
    console.log(object)
    console.log('\n')
  }

  it('create a customer', async () => {
    const customerData = {
      name: faker.name.findName(),
      email: faker.internet.email().toLowerCase(),
      address: {
        line1: faker.address.streetAddress(),
        line2: '501',
        city: faker.address.city(),
        state: faker.address.stateAbbr(),
        postal_code: faker.address.zipCode().replace('-', '')
      }
    }

    const customer = await stripe.customers.create(customerData)

    expect(customer).to.be.not.undefined()
    expect(customer).to.have.property('id')
    expect(customer.balance).to.be.equal(0)

    log('Customer created', customer)
  })

  it('create a customer and multiple payments with same method', async () => {
    const customerData = {
      name: faker.name.findName(),
      email: faker.internet.email().toLowerCase(),
      address: {
        line1: faker.address.streetAddress(),
        city: faker.address.city(),
        state: faker.address.stateAbbr(),
        postal_code: faker.address.zipCode().replace('-', '')
      }
    }
    const customer = await stripe.customers.create(customerData)
    log('Customer created', customer)

    const paymentMethod = await stripe.paymentMethods.create({
      type: 'card',
      card: { token: 'tok_mastercard' }
    })
    log('Payment method created', customer)

    await stripe.paymentMethods.attach(paymentMethod.id, {
      customer: customer.id
    })

    const paymentIntent = await stripe.paymentIntents.create({
      customer: customer.id,
      amount: 2999,
      currency: 'brl',
      payment_method_types: ['card'],
      payment_method: paymentMethod.id,
      confirm: true
    })
    log('Payment intent created', paymentIntent)
  })

  it('create a customer and a payment intent', async () => {
    const customerData = {
      name: faker.name.findName(),
      email: faker.internet.email().toLowerCase(),
      address: {
        line1: faker.address.streetAddress(),
        city: faker.address.city(),
        state: faker.address.stateAbbr(),
        postal_code: faker.address.zipCode().replace('-', '')
      }
    }
    const customer = await stripe.customers.create(customerData)
    log('Customer created', customer)

    const paymentMethod = await stripe.paymentMethods.create({
      type: 'card',
      card: { token: 'tok_mastercard' }
    })
    log('Payment method created', customer)

    await stripe.paymentMethods.attach(paymentMethod.id, {
      customer: customer.id
    })

    log(
      'Payment intent #1 created',
      await stripe.paymentIntents.create({
        customer: customer.id,
        amount: 2999,
        currency: 'brl',
        payment_method_types: ['card'],
        payment_method: paymentMethod.id,
        confirm: true
      })
    )

    log(
      'Payment intent #2 created',
      await stripe.paymentIntents.create({
        customer: customer.id,
        amount: 14999,
        currency: 'brl',
        payment_method_types: ['card'],
        payment_method: paymentMethod.id,
        confirm: true
      })
    )

    log(
      'Payment intent #3 created',
      await stripe.paymentIntents.create({
        customer: customer.id,
        amount: 59999,
        currency: 'brl',
        payment_method_types: ['card'],
        payment_method: paymentMethod.id,
        confirm: true
      })
    )
  })

  it('create a customer, a payment subscription', async () => {
    const product = await stripe.products.create({
      name: 'Plano Middle',
      description: '1000 alunos'
    })
    log('Product created', product)

    const price = await stripe.prices.create({
      unit_amount: 2999,
      currency: 'brl',
      recurring: { interval: 'day' },
      product: product.id
    })
    log('Price created', price)

    const customerData = {
      name: faker.name.findName(),
      email: faker.internet.email().toLowerCase(),
      address: {
        line1: faker.address.streetAddress(),
        city: faker.address.city(),
        state: faker.address.stateAbbr(),
        postal_code: faker.address.zipCode().replace('-', '')
      }
    }
    const customer = await stripe.customers.create(customerData)
    log('Customer created', customer)

    const paymentMethod = await stripe.paymentMethods.create({
      type: 'card',
      card: { token: 'tok_mastercard' }
    })
    log('Payment method created', customer)

    log(
      'Payment method attached',
      await stripe.paymentMethods.attach(paymentMethod.id, {
        customer: customer.id
      })
    )

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: price.id }],
      default_payment_method: paymentMethod.id
    })

    log('Subscription created', subscription)
  })
})
