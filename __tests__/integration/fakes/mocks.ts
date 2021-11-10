import request, { SuperTest, Test } from 'supertest'
import faker from 'faker'
import { v4 as uuid } from 'uuid'
import { Application } from 'express'
import { Connection, ConnectionOptions, createConnection } from 'typeorm'

import { Incident } from '@entities/Incident'
import { Ong } from '@entities/Ong'

import ormconfig from '../../../ormconfig'

faker.locale = 'pt_BR'

type CreateFakeIncidentParams = {
  ong_id: string
  ongToken: string
}

type CreateFakeDonationParams = {
  incident_id: string
  donorToken: string
}

export const mock = {
  ong: {
    name: faker.name.findName(),
    email: faker.internet.email().toLowerCase(),
    password: 'somepassword123',
    phone: faker.phone.phoneFormats()
  },
  donor: {
    name: faker.name.findName(),
    email: faker.internet.email().toLowerCase(),
    password: 'somepassword123',
    phone: faker.phone.phoneFormats()
  },
  incident: {
    name: faker.fake('{{animal.dog}}'),
    cost: Number(faker.commerce.price()),
    description: `This animal is type ${faker.fake('{{animal.type}}')}`
  }
}

export function createAgent(app: Application): SuperTest<Test> {
  return request(app)
}

export async function createTestingConnection(name: string = uuid()): Promise<Connection> {
  return await createConnection({
    ...ormconfig,
    name,
  } as ConnectionOptions)
}

export async function createFakeOng(agent: SuperTest<Test>): Promise<Ong> {
  const response = await agent.post('/ongs').send(mock.ong)

  return response.body
}

export async function createFakeDonor(agent: SuperTest<Test>): Promise<Ong> {
  const response = await agent.post('/donors').send(mock.donor)

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
  const { email, password } = mock.ong

  const response = await agent.post('/ongs/login').send({
    email,
    password
  })

  return response.body.token
}

export async function loginWithFakeDonor(
  agent: SuperTest<Test>
): Promise<string> {
  const { email, password } = mock.donor

  const response = await agent.post('/donors/login').send({
    email,
    password
  })

  return response.body.token
}
