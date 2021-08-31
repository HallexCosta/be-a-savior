import { Stripe } from 'stripe'
import { unlink } from 'fs/promises'
import { resolve } from 'path'

import ormconfig from '../../ormconfig'

import { ongs } from './ongs.routes.spec'
import { donors } from './donors.routes.spec'
import { incidents } from './incidents.routes.spec'
import { donations } from './donations.routes.spec'

async function log(message: string, callback: () => Promise<void>) {
  console.log(`\n${message}`)
  await callback()
}

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
    console.log('> Delete', customer.email)
    await stripe.customers.del(customer.id)
  }

  await dropTestCustomers()
}
async function dropTestDatabase() {
  await unlink(resolve(__dirname, '..', '..', ormconfig.database))
  console.log('> Droped database')
}

async function drops() {
  await log('> Drop all test customers', dropTestCustomers)
  await log('> Drop test database', dropTestDatabase)
}

describe('Integration Tests', () => {
  after(async () => await drops())
  ongs()
  donors()
  incidents()
  donations()
})
