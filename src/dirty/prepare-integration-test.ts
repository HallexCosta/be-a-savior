import fs from 'fs/promises'
import dotenv from 'dotenv'
import path from 'path'
import { createConnection } from 'typeorm'

import { URL } from 'url'
import { ElephantSQLInstanceProvider } from '@providers/elephant/ElephantSQLInstanceProvider'

const environment = process.env.NODE_ENV
const apikey = process.env.ELEPHANT_API_KEY
const instanceName = process.env.ELEPHANT_INSTANCE_NAME
const elephantProvider = new ElephantSQLInstanceProvider(apikey)

async function prepareEnvironment(environment: string = null) {
  environment = environment.toUpperCase()

  const lines = (await fs.readFile('.env')).toString().split('\n')

  const declaredElephantInstance = lines.find(line => line.includes('ELEPHANT_INSTANCE_NAME'))
  if (!declaredElephantInstance) {
    console.error('Ops... not found environment variable "ELEPHANT_INSTANCE_NAME"')
    return
  }

  const replaces = [
    `DB_TYPE_${environment}`,
    `DB_HOST_${environment}`,
    `DB_PORT_${environment}`,
    `DB_USERNAME_${environment}`,
    `DB_PASSWORD_${environment}`,
    `DB_NAME_${environment}`
  ]

  const newLines = []

  console.log('> Up database: %s', instanceName)
  await elephantProvider.deleteInstance(instanceName)
  const instance = await elephantProvider.createInstance({
    name: instanceName,
    plan: 'turtle',
    region: 'amazon-web-services::us-east-1'
  })

  for (const line of lines) {
    if (!replaces.includes(line.split('=')[0])) {
      newLines.push(line)
    }
  }

  const configs = parseDBConfigs(instance.url)
  const dbconfigs = replaces.map(replace => {
    return `${replace}=${configs.get(replace.split('_')[1].toLocaleLowerCase())}`
  })

  newLines.push(...dbconfigs)

  console.log('> Rewrite db configs test in .env...')
  const content = newLines.filter(line => line !== '\n').join('\n')
  await fs.writeFile('.env', content)

  console.log('> Override db configs: %s', environment.toLocaleLowerCase())
  const env = dotenv.parse(await fs.readFile(path.resolve(process.cwd(), '.env')))
  for (const k in env) {
    process.env[k] = env[k]
  }

  const seconds = 6 * 1000
  await sleep(seconds)

  console.log('> Run migrations...')
  const connection = await createConnection()
  await connection.runMigrations()
}

function parseDBConfigs(url: string): Map<string, string> {
  const { protocol: type, host, username, password } = new URL(url)
  const parseType = type.substr(0, type.lastIndexOf(':'))

  const configs = new Map()
  configs.set('type', parseType)
  configs.set('host', host)
  configs.set('port', 5432)
  configs.set('username', username)
  configs.set('password', password)
  configs.set('name', username)

  return configs
}

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

console.log('> Prepare environment: %s', environment)
prepareEnvironment(environment)
