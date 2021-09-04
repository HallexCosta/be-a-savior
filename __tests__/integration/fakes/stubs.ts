import { v4 as uuid } from 'uuid'
import { Connection, ConnectionOptions, createConnection } from 'typeorm'
import request, { SuperTest, Test } from 'supertest'
import { Application } from 'express'

import { Incident } from '@entities/Incident'
import { Ong } from '@entities/Ong'

import ormconfig from '../../../ormconfig'

type CreateFakeIncidentParams = {
  ong_id: string
  ongToken: string
}

type CreateFakeDonationParams = {
  incident_id: string
  donorToken: string
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
    ...ormconfig,
    name: uuid(),
    migrationsRun: true,
    dropSchema: true
  } as ConnectionOptions)
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
  { ong_id, ongToken }: CreateFakeIncidentParams
): Promise<Incident> {
  const body = {
    name: 'Dog',
    cost: 74.7,
    description: 'Run over the Dog and it dead :(',
    ong_id
  }

  const response = await agent
    .post('/incidents')
    .send(body)
    .set('Authorization', `bearer ${ongToken}`)

  return response.body
}

export async function createFakeDonation(
  agent: SuperTest<Test>,
  { incident_id, donorToken }: CreateFakeDonationParams
): Promise<Incident> {
  const body = {
    incident_id
  }

  const response = await agent
    .post('/donations')
    .send(body)
    .set('Authorization', `bearer ${donorToken}`)

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
