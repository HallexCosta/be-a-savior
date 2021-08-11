import { v4 as uuid } from 'uuid'
import { Connection, createConnection } from 'typeorm'
import request, { SuperTest, Test } from 'supertest'
import { Application } from 'express'

import { Incident, Ong } from '@entities'

const body = {
  name: 'Some a name',
  email: 'some@hotmail.com',
  password: 'some123',
  phone: '(99) 99999-9999'
}

export function createAgent(app: Application): SuperTest<Test> {
  return request(app)
}

export async function createTestingConnection(): Promise<Connection> {
  return await createConnection({
    name: uuid(),
    type: 'sqlite',
    database: 'src/database/database-test.sqlite',
    migrations: ['src/database/migrations/*.ts'],
    entities: ['src/entities/*.ts'],
    migrationsRun: true,
    dropSchema: true,
    cli: {
      migrationsDir: 'src/database/migrations',
      entitiesDir: 'src/entities'
    }
  })
}

export async function createFakeOng(agent: SuperTest<Test>): Promise<Ong> {
  const response = await agent.post('/ongs').send(body)

  return response.body
}

export async function createFakeIncident(
  agent: SuperTest<Test>,
  ong_id: string
): Promise<Incident> {
  const body = {
    name: 'Dog',
    coast: 74.7,
    description: 'Run over the Dog and it dead :(',
    ong_id: ong_id
  }

  const response = await agent.post('/incidents').send(body)

  return response.body
}

export async function loginWithFakeOng(
  agent: SuperTest<Test>
): Promise<string> {
  const { email, password } = body

  const response = await agent.post('/ongs/login').send({
    email,
    password
  })

  return response.body.token
}
