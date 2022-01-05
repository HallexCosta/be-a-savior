import request, { SuperTest, Test } from 'supertest'
import faker from 'faker'
import { v4 as uuid } from 'uuid'
import { Application } from 'express'
import { Connection, ConnectionOptions, createConnection } from 'typeorm'

import { Incident } from '@entities/Incident'
import { Donor } from '@entities/Donor'
import { Ong } from '@entities/Ong'

import { Util } from '@tests/util'

import ormconfig from '@root/ormconfig'

faker.locale = 'pt_BR'

type OngMock = UserMock
type DonorMock = UserMock
type IncidentMock = {
  name: string
  cost: number
  description: string
}
type DonationMock = {
  incidentId: string
  amount: number
}

type CreateFakeIncidentParams = {
  incidentMock: IncidentMock
  ongToken: string
}

type CreateFakeDonationParams = {
  donationMock: DonationMock
  donorToken: string
}

type UserMock = {
  name: string
  email: string
  password: string
  phone: string
}

export type BeASaviorMocks = {
  ong: OngMock
  donor: DonorMock
  incident: IncidentMock
  donation: DonationMock
}

export const createMocks: () => BeASaviorMocks = () => ({
  ong: {
    id: uuid(),
    name: faker.name.findName(),
    email: faker.internet.email().toLowerCase(),
    password: 'somepassword123',
    phone: faker.phone.phoneFormats(),
    owner: 'ong',
    created_at: new Date(),
    updated_at: new Date()
  },
  donor: {
    id: uuid(),
    name: faker.name.findName(),
    email: faker.internet.email().toLowerCase(),
    password: 'somepassword123',
    phone: faker.phone.phoneFormats(),
    owner: 'donor',
    created_at: new Date(),
    updated_at: new Date()
  },
  incident: {
    id: uuid(),
    name: faker.fake('{{animal.dog}}'),
    cost: Number(faker.commerce.price()),
    description: `This animal is type ${faker.fake('{{animal.type}}')}`,
    created_at: new Date(),
    updated_at: new Date()
  },
  donation: {
    uuid: uuid(),
    incidentId: 'this is incident_id :/',
    amount: Number(faker.commerce.price()),
    created_at: new Date(),
    updated_at: new Date()
  }
})

export function createAgent(app: Application): SuperTest<Test> {
  return request(app)
}

export async function createTestingConnection(name: string = uuid()): Promise<Connection> {
  return await createConnection({
    ...ormconfig,
    name,
  } as ConnectionOptions)
}

export async function createFakeOng(agent: SuperTest<Test>, ongMock: OngMock): Promise<Ong> {
  const response = await agent.post('/ongs').send(ongMock)

  Util.customersEmail.push(ongMock.email)

  return response.body
}

export async function createFakeDonor(agent: SuperTest<Test>, donorMock: DonorMock): Promise<Donor> {
  const response = await agent.post('/donors')
    .send(donorMock)

  return response.body
}

export async function createFakeIncident(
  agent: SuperTest<Test>,
  { incidentMock, ongToken }: CreateFakeIncidentParams
): Promise<Incident> {
  const response = await agent
    .post('/incidents')
    .send(incidentMock)
    .set('Authorization', `bearer ${ongToken}`)

  return response.body
}

export async function createFakeDonation(
  agent: SuperTest<Test>,
  { donationMock, donorToken }: CreateFakeDonationParams
): Promise<Incident> {
  const response = await agent
    .post('/donations')
    .send({
      ...donationMock,
      incident_id: donationMock.incidentId
    })
    .set('Authorization', `bearer ${donorToken}`)

  return response.body
}

export async function loginWithFakeOng(
  agent: SuperTest<Test>,
  ongMock: OngMock
): Promise<string> {
  const { email, password } = ongMock

  const response = await agent.post('/ongs/login').send({
    email,
    password
  })

  return response.body.token
}

export async function loginWithFakeDonor(
  agent: SuperTest<Test>,
  donorMock: DonorMock
): Promise<string> {
  const { email, password } = donorMock

  const response = await agent.post('/donors/login').send({
    email,
    password
  })

  return response.body.token
}
