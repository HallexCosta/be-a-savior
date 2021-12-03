import { Stripe } from 'stripe'
import { ElephantSQLInstanceProvider } from '@providers/elephant/ElephantSQLInstanceProvider'

import { getConnection, createConnection } from 'typeorm'

const apikey = process.env.ELEPHANT_API_KEY
const instanceName: string = process.env.ELEPHANT_INSTANCE_NAME
const elephantProvider = new ElephantSQLInstanceProvider(apikey)
const tableNames = ['donations', 'incidents', 'users', 'migrations']

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
