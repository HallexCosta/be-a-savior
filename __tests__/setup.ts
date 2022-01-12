import { Stripe } from 'stripe'

import { getConnection, createConnection } from 'typeorm'

import { Util } from '@tests/util'

const instanceName: string = process.env.ELEPHANT_INSTANCE_NAME
const tableNames = ['donations', 'incidents', 'users', 'migrations']

async function dropTestCustomers() {
  const stripeApiKey = process.env.STRIPE_SECRET_API_KEY || process.env.STRIPE_SECRET_API_KEY_TEST
  const stripe = new Stripe(stripeApiKey, {
    apiVersion: '2020-08-27'
  })

  for (const email of Util.customersEmail) {
    console.log('> Delete %s', email)

    try {
      const { data: [customer] } = await stripe.customers.list({
        email
      })

      const alreadyCustomer = await stripe.customers.retrieve(customer.id)

      if (!alreadyCustomer.deleted) {
        await stripe.customers.del(customer.id)
      }
    } catch (e) { }
  }
}

async function dropTables(tableNames: string[]) {
  const connection = getConnection()
  const queryRunner = connection.createQueryRunner();

  for (const tableName of tableNames) {
    const isTable = await queryRunner.hasTable(tableName)
    if (isTable) {
      console.log('> drop table: %s', tableName)
      await queryRunner.dropTable(tableName)
    }
  }
}

before(async () => {
  console.log('> Up migration')
  const connection = await createConnection()
  await connection.runMigrations()
})

after(async () => {
  console.log('> Drop all customers')
  await dropTestCustomers()

  console.log('> Instance name: %s', instanceName)
  await dropTables(tableNames)
})
