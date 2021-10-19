import fs from 'fs/promises'
import dotenv from 'dotenv'
import path from 'path'
import { createConnection } from 'typeorm'

import { URL } from 'url'
import { ElephantSQLInstanceProvider } from '@providers/elephant/ElephantSQLInstanceProvider'

const apikey = process.env.ELEPHANT_API_KEY
const elephantProvider = new ElephantSQLInstanceProvider(apikey)

async function prepareEnvironment(environment: string = null) {
  environment = environment.toUpperCase()
  const lines = (await fs.readFile('.env.test')).toString().split('\n')
  const defineInstanceName = lines.map(line => {
    if (line === 'ELEPHANT_INSTANCE_NAME') return 1
  })
  if (defineInstanceName.length == 0) throw new Error('Ops... not found nothing elephant instance name')


  const replaces = [
    `DB_TYPE_${environment}`,
    `DB_HOST_${environment}`,
    `DB_PORT_${environment}`,
    `DB_USERNAME_${environment}`,
    `DB_PASSWORD_${environment}`,
    `DB_NAME_${environment}`
  ]

  let configs: Map<string, string>

  const newLines = []
  for (const line of lines) {
    if (line.includes('ELEPHANT_INSTANCE_NAME')) {
      const instanceName = line.substr(line.indexOf('=') + 1, line.indexOf('='))

      console.log('> Up database: %s', instanceName)
      await elephantProvider.deleteInstance(instanceName)
      const instance = await elephantProvider.createInstance({
        name: instanceName,
        plan: 'turtle',
        region: 'amazon-web-services::us-east-1'
      })

      configs = parseDBConfigs(instance.url)
    }
    newLines.push(line)
  }

  const dbconfigs = replaces.map(replace => {
    return `${replace}=${configs.get(replace.split('_')[1].toLocaleLowerCase())}`
  })

  newLines.push(...dbconfigs)

  console.log('> Rewrite db configs test in .env...')
  const content = newLines.join('\n')
  await fs.writeFile('.env', content)

  console.log('> Override db configs test')
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

console.log('> Prepare environment: %s', process.env.NODE_ENV)
prepareEnvironment(process.env.NODE_ENV)
