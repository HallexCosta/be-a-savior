import fs from 'fs/promises'
import dotenv from 'dotenv'
import path from 'path'
import { createConnection } from 'typeorm'

import { URL } from 'url'
import { ElephantSQLInstanceProvider } from '@providers/elephant/ElephantSQLInstanceProvider'

const environment = process.env.NODE_ENV
const apikey = process.env.ELEPHANT_API_KEY
const instanceName = process.env.ELEPHANT_INSTANCE_NAME_TEST
const elephantProvider = new ElephantSQLInstanceProvider(apikey)

async function prepareEnvironment(environment: string = null) {
  environment = environment.toUpperCase()

  const lines = (await fs.readFile('.env.example')).toString().split('\n')

  const declaredElephantInstance = lines.find(line => line.includes('ELEPHANT_INSTANCE_NAME'))
  if (!declaredElephantInstance) {
    console.error('Ops... not found environment variable "ELEPHANT_INSTANCE_NAME"')
    return
  }

  console.log('> Up database: %s', instanceName)
  await elephantProvider.deleteInstance(instanceName)
  const instance = await elephantProvider.createInstance({
    name: instanceName,
    plan: 'turtle',
    region: 'amazon-web-services::us-east-1'
  })

  const envMain = new Map<string, string>() as Map<string, string>

  const [] = (await fs.readFile('.env.example')).toString().split('\n').map(line => {
    const [key, value] = line.split('=')
    envMain.set(key, value)
  })


  const [] = (await fs.readFile('.env')).toString().split('\n').map(line => {
    const [key, value] = line.split('=')
    envMain.set(key, value)
  })


  envMain.forEach((value, key) => value === 'undefined' || value === undefined ? envMain.delete(key) : null)

  const configs = parseDBConfigs(instance.url)

  envMain.forEach((value, key) => envMain.set(key.toUpperCase(), value))
  configs.forEach((value, key) => envMain.set(key.toUpperCase(), value))


  console.log('> Rewrite db configs test in .env...')
  const content = []
  for (const [key, value] of envMain.entries()) {
    content.push(`${key}=${value}`)
  }
  if (fs.access('.env')) {
    await fs.writeFile('.env.bkp', await fs.readFile('.env'))
  } else {
    await fs.writeFile('.env.bkp', (process.env as unknown as []).join('\n'))
  }
  await fs.writeFile('.env', content.join('\n'))

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
  configs.set(`DB_TYPE_${environment}`, parseType)
  configs.set(`DB_HOST_${environment}`, host)
  configs.set(`DB_PORT_${environment}`, 5432)
  configs.set(`DB_USERNAME_${environment}`, username)
  configs.set(`DB_PASSWORD_${environment}`, password)
  configs.set(`DB_NAME_${environment}`, username)

  return configs
}

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

console.log('> Prepare environment: %s', environment)
prepareEnvironment(environment)
