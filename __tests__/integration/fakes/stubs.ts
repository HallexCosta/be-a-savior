import { v4 as uuid } from 'uuid'
import { Connection, createConnection } from 'typeorm'
import request, { SuperTest, Test } from 'supertest'
import { Application } from 'express'

import { Incident } from '@entities/Incident'
import { Ong } from '@entities/Ong'

type CreateFakeIncidentParams = {
  ong_id: string
  token: string
}

const body = {
  ong: {
    name: 'Some a ong',
    email: 'ong@hotmail.com',
    password: 'some123',
    phone: '(99) 99999-9999'
  },
  donor: {
    name: 'Some a donor',
    email: 'donor@hotmail.com',
    password: 'some123',
    phone: '(99) 99999-9999'
  }
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
  const response = await agent.post('/ongs').send(body.ong)

  return response.body
}

export async function createFakeDonor(agent: SuperTest<Test>): Promise<Ong> {
  const response = await agent.post('/donors').send(body.donor)

  return response.body
}

export async function createFakeIncident(
  agent: SuperTest<Test>,
  { ong_id, token }: CreateFakeIncidentParams
): Promise<Incident> {
  const body = {
    name: 'Dog',
    coast: 74.7,
    description: 'Run over the Dog and it dead :(',
    ong_id
  }

  const response = await agent
    .post('/incidents')
    .send(body)
    .set('Authorization', `bearer ${token}`)

  return response.body
}

export async function loginWithFakeOng(
  agent: SuperTest<Test>
): Promise<string> {
  const { email, password } = body.ong

  const response = await agent.post('/ongs/login').send({
    email,
    password
  })

  return response.body.token
}

export async function loginWithFakeDonor(
  agent: SuperTest<Test>
): Promise<string> {
  const { email, password } = body.donor

  const response = await agent.post('/donors/login').send({
    email,
    password
  })

  return response.body.token
}
