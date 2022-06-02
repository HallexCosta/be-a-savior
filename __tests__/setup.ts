import fs from 'fs/promises'

import { Stripe } from 'stripe'

import { getConnection, createConnection, ConnectionOptions } from 'typeorm'

import { Util } from '@tests/util'
import ormconfig from '@root/ormconfig'

const instanceName: string = process.env.ELEPHANT_INSTANCE_NAME

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

async function getTableNames(): Promise<string[]> {
  const directory = './src/database/migrations'
  const files = await fs.readdir(directory)

  return files.map(file => {
    // split CamelCase word, ex: CreateIncidents -> ['Create', 'Incidents']
    const frags = file.split(/(?=[A-Z])/g)
    const filename = frags.pop().split('.')
    const tableName = filename.shift().toLowerCase()
    return tableName
  })
}

async function dropTables(tableNames: string[]) {
  const connection = Util.getConnectionAdapter(process.pid.toString())
  const queryRunner = connection.createQueryRunner();

  for (const tableName of tableNames) {
    const isTable = await queryRunner.hasTable(tableName)
    const haveMigrationsTable = await queryRunner
      .hasTable('migrations')

    const mainTable = 'migrations'
    if (haveMigrationsTable) {
      console.log('> drop main table:', mainTable)
      await queryRunner.dropTable('migrations')
    }

    if (isTable) {
      console.log('> drop table: %s', tableName)
      await queryRunner.dropTable(tableName)
    }
  }
}

before(async () => {
  const connection = await createConnection(ormconfig as ConnectionOptions)

  console.log('> Drop exists tables')
  const tableNames = await getTableNames()
  await dropTables(tableNames.reverse())

  console.log('> Up migration')
  await connection.runMigrations()
})

after(async () => {
  console.log('> Drop all customers')
  await dropTestCustomers()

  console.log('> Instance name: %s', instanceName)
  const tableNames = await getTableNames()
  await dropTables(tableNames.reverse())
})
