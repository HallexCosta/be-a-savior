import fs from 'fs/promises'
import dotenv from 'dotenv'
import path from 'path'
import { v4 as uuid } from 'uuid'
import { createConnection } from 'typeorm'

import { URL } from 'url'
import { ElephantSQLInstanceProvider } from '@providers/elephant/ElephantSQLInstanceProvider'

const environment = process.env.NODE_ENV
const apikey = process.env.ELEPHANT_API_KEY
const instanceName = uuid()
const elephantProvider = new ElephantSQLInstanceProvider(apikey)

async function prepareEnvironment(environment: string = null) {
  environment = environment.toUpperCase()

  //const lines = (await fs.readFile('.env.example')).toString().split('\n')

  //const declaredElephantInstance = lines.find(line => line.includes('ELEPHANT_INSTANCE_NAME_TEST'))
  //if (!declaredElephantInstance) {
  //  console.error('Ops... not found environment variable "ELEPHANT_INSTANCE_NAME_TEST"')
  //  return
  //}

  console.log('> Up database: %s', instanceName)

  await elephantProvider.deleteInstance(instanceName)

  let seconds = 6 * 1000
  await sleep(seconds)

  const instance = await elephantProvider.createInstance({
    name: instanceName,
    plan: 'turtle',
    region: 'amazon-web-services::us-east-1'
  })
  console.log('> Creating instance...', instance)

  const envMain = new Map<string, string>() as Map<string, string>

  //if (!process.env.DOCKER_CONTAINER) {
  const [] = (await fs.readFile('.env.example')).toString().split('\n').map(line => {
    const [key, value] = line.split('=')
    envMain.set(key, value)
  })

  if (!process.env.IN_REMOTE) {
    const [] = (await fs.readFile('.env')).toString().split('\n').map(line => {
      const [key, value] = line.split('=')
      envMain.set(key, value)
    })
  }

  envMain.forEach((value, key) => value === 'undefined' || value === undefined ? envMain.delete(key) : null)
  envMain.forEach((value, key) => envMain.set(key.toUpperCase(), value))
  //}

  const configs = parseDBConfigs(instance.url)
  configs.forEach((value, key) => envMain.set(key.toUpperCase(), value))

  envMain.set('ELEPHANT_INSTANCE_NAME_TEST', uuid())

  console.log('> Rewrite db configs test in .env...')

  if (process.env.GITHUB_ACTIONS) {
    console.log('Env main in github actions', envMain)
    for (const [key, value] of envMain) {
      process.env[key] = value
    }
  } else {
    const content = []

    for (const [key, value] of envMain.entries()) {
      content.push(`${key}=${value}`)
    }

    await fs.writeFile('.env.bkp', await fs.readFile('.env'))
    await fs.writeFile('.env', content.join('\n'))

    console.log('> Override db configs: %s', environment.toLocaleLowerCase())
    const env = dotenv.parse(await fs.readFile(path.resolve(process.cwd(), '.env')))
    for (const k in env) {
      process.env[k] = env[k]
    }
  }

  seconds = 6 * 1000
  await sleep(seconds)

  console.log('> Run migrations...')
  const connection = await createConnection()
  await connection.runMigrations()
}

function parseDBConfigs(url: string): Map<string, string> {
  const { protocol: type, host, username, password } = new URL(url)
  const parseType = type.substr(0, type.lastIndexOf(':'))

  const configs = new Map()
  configs.set(`DB_TYPE`, parseType)
  configs.set(`DB_HOST`, host)
  configs.set(`DB_PORT`, 5432)
  configs.set(`DB_USERNAME`, username)
  configs.set(`DB_PASSWORD`, password)
  configs.set(`DB_NAME`, username)

  return configs
}

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function isGithubActions() {
  return process.env.IN_REMOTE ? 'github actions' : 'locally'
}
function isDockerContainer() {
  return process.env.DOCKER_CONTAINER ? 'with docker container' : 'without docker container'
}

console.log('> Prepare environment %s in %s %s', environment, isGithubActions(), isDockerContainer())
prepareEnvironment(environment)
