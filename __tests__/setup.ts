import { Stripe } from 'stripe'
import { ElephantSQLInstanceProvider } from '@providers/elephant/ElephantSQLInstanceProvider'

import ormconfig from '../ormconfig'

const apikey = process.env.ELEPHANT_API_KEY
const instanceName: string = process.env.ELEPHANT_INSTANCE_NAME
const elephantProvider = new ElephantSQLInstanceProvider(apikey)

async function dropTestCustomers() {
  const stripe = new Stripe(process.env.STRIPE_SECRET_API_KEY, {
    apiVersion: '2020-08-27'
  })
  const { data: customers } = await stripe.customers.list()
  if (customers.length === 0) {
    console.log('> All customers were deleted')
    return
  }

  for (const customer of customers) {
    console.log('> Delete %s', customer.email)
    try {
      const alreadyCustomer = await stripe.customers.retrieve(customer.id)

      if (!alreadyCustomer.deleted) {
        await stripe.customers.del(customer.id)
      }
    } catch (e) { }
  }

  await dropTestCustomers()
}

async function dropDatabase(type: string, instanceName: string = null) {
  if (type === 'postgres') {
    //await elephantProvider.deleteInstance(instanceName)
  }
}

after(async () => {
  console.log('> Drop all customers')
  await dropTestCustomers()

  console.log('> Drop database: %s', instanceName)
  //await dropDatabase(ormconfig.type, instanceName)
})
