import dotenv from 'dotenv'
import fs from 'fs/promises'

import { URL } from 'url'
import { Stripe } from 'stripe'
import { ElephantSQLInstanceProvider } from '@providers/elephant/ElephantSQLInstanceProvider'

import ormconfig from '../ormconfig'

type DBConfigs = {
  type: string
  host: string
  port: number
  username: string
  password: string
  name: string
}

const apikey = process.env.ELEPHANT_API_KEY
let instanceName: string
const elephantProvider = new ElephantSQLInstanceProvider(apikey)

dotenv.config({ path: '.env' })

async function prepareEnvironment() {
  const lines = (await fs.readFile('.env.test')).toString()
  const newLines = []
  for (const line of lines.split('\n')) {
    if (line.includes('ELEPHANT_INSTANCE_NAME')) {
      instanceName = line.substr(line.indexOf('=') + 1, line.indexOf('='))

      console.log('> Up database %s', instanceName)
      const instance = await elephantProvider.createInstance({
        name: instanceName,
        plan: 'turtle',
        region: 'amazon-web-services::us-east-1'
      })

      const configs = parseDBConfigs(instance.url)

      newLines.push(...injectDBConfigs(configs))
      newLines.push(line)
    } else {
      newLines.push(line)
    }
  }

  const content = newLines.join('\n')
  await fs.writeFile('.env', content)
}

function parseDBConfigs(url: string): DBConfigs {
  const { protocol: type, host, username, password } = new URL(url)
  const parseType = type.substr(0, type.lastIndexOf(':'))

  return {
    type: parseType,
    host,
    port: 5432,
    username,
    password,
    name: username
  }
}

function injectDBConfigs({ type, host, port, username, password, name }: DBConfigs) {
  const dbConfigsText = `
DB_TYPE=${type}
DB_HOST=${host}
DB_PORT=${port}
DB_USERNAME=${username}
DB_PASSWORD=${password}
DB_NAME=${name}
`
  return dbConfigsText.split('\n')
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
    console.log('> Delete %s', customer.email)
    await stripe.customers.del(customer.id)
  }

  await dropTestCustomers()
}

async function dropDatabase(type: string, instanceName: string = null) {
  if (type === 'postgres') {
    await elephantProvider.deleteInstance(instanceName)
  }
}

before(async () => {
  console.log('> Prepare environment...')
  await prepareEnvironment()
})

after(async () => {
  console.log('> Drop all customers')
  await dropTestCustomers()

  console.log('> Drop database: %s', instanceName)
  await dropDatabase(ormconfig.type, instanceName)
})
